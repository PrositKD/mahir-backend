import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ObjectId } from 'mongodb';
import { ProductService } from './product.service';
import { EventService } from '../event/event.service';
import { EventBookingSevice } from '../event-booking/event-booking.sevice';
import { PaymentService } from '../payment/payment.service';
import { generateTransactionID } from '../../utils/helpers';
import Payment from '../payment/payment.model';
import mongoose, { Types } from 'mongoose';
import {
    executePaypelPayment,
    executeRazorpayPayment,
    executeStripePayment,
    paypalPaymentInfoDB,
    razorpayPaymentInfoBD,
    stripePaymentInfoDB,
} from '../payment/payment.utils';
import { OrderService } from '../order/order.service';
import { generateOrderID } from '../order/order.utils';
import httpStatus from 'http-status';

export class ProductController {
    static createProductbyPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ProductService.findProductByQuery(
            {
                name: body.name,
            },
            {},
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'This product already exists. Please check your existing product.',
            );
        }

        await ProductService.postProductByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Product created successfully',
            data: undefined,
        });
    });
    static createProductPayment = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        let data = null;
        const product = await ProductService.findProductById(body.product);
        const amount =
            product.price.discount_type == 'flat'
                ? product.price.amount - product.price.discount
                : (product.price.amount * product.price.discount) / 100;

        const payment: any = await PaymentService.createPaymentByPayload({
            user: user._id,
            payment_type: 'product',
            method: body.method,
            status: 'pending',
            transaction_id: await generateTransactionID('C', Payment),
            amount,
        });
        const order = await OrderService.createOrder({
            user: user._id,
            orderId: await generateOrderID('OD'),
            product: product._id,
            amount: amount,
            name: product.name,
            image: product.thumb_image,
            status: 'pending',
            payment: payment._id,
        });
        const payload: {
            amount: number;
            payment_type: string;
            order_id: Types.ObjectId;
        } = {
            amount,
            payment_type: 'product',
            order_id: order._id,
        };
        if (body.method == 'stripe') {
            data = await executeStripePayment(payload);
        } else if (body.method == 'paypal') {
            data = await executePaypelPayment(payload);
        } else if (body.method == 'razorpay') {
            data = await executeRazorpayPayment(payload);
        } else {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                "Payment method doesn't exist! please try again",
            );
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Your payment is processing',
            data,
        });
    });
    static updateProdutPayment = catchAsync(async (req, res) => {
        const { body } = req.body;
        if (body?.method === 'stripe') {
            if (!body.session) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed',
                    'Session is required for stripe payment',
                );
            }
            await stripePaymentInfoDB({
                session: body.session,
            });
        } else if (body?.method === 'paypal') {
            if (!body.paymentId || !body.PayerID) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed',
                    'paymentId and PayerID  is required for paypal payment',
                );
            }
            await paypalPaymentInfoDB({
                paymentId: body.paymentId,
                PayerID: body.PayerID,
            });
        } else if (body?.method === 'razorpay') {
            if (!body.razorpay_payment_id) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed',
                    'razorpay_payment_id is required',
                );
            }
            await razorpayPaymentInfoBD({
                razorpay_payment_id: body.razorpay_payment_id,
            });
        } else {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                "Payment method doesn't exist !",
            );
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Payment successfully',
            data: undefined,
        });
    });
    static getProductOrders = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const { user } = res.locals;
        if (user.role == 'user') {
            filter['user'] = new mongoose.Types.ObjectId(user._id);
        }
        if (query.status) {
            filter['status'] = query.status;
        }

        if (query.search) {
            filter[`$or`] = [
                { orderId: { $regex: new RegExp(query.search, 'i') } },
                { name: { $regex: new RegExp(query.search, 'i') } },
            ];
        }
        if (query._id) {
            const data = await OrderService.findOrderById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Order get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await OrderService.findOrdersWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Order list get successfully',
            data: dataList,
        });
    });
    static updateProductOrders = catchAsync(async (req, res) => {
        const { body }: any = req.body;
        await OrderService.findOrderById(body._id);
        await OrderService.updateOrder(
            {_id: body._id },
            body
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Order updated successfully',
            data: undefined,
        });
    });
    static getProductListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.search) {
            filter[`name`] = { $regex: new RegExp(query.search, 'i')};
        }

        if (query._id) {
            const data = await ProductService.findProductById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Product get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await ProductService.findProductListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product list get successfully',
            data: dataList,
        });
    });
    static getProductListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`name.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query.category) {
            filter['category'] = new ObjectId(query.category);
        }
        const select = {
            __v: 0,
            status: 0,
            additional_info: 0,
            updatedAt: 0,
        };
        if (query._id) {
            const data = await ProductService.findProductById(query._id);
            const related_products =
                await ProductService.findProductListByQuery(
                    { category: data.category._id },
                    query,
                    select,
                    false,
                );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Product get successfully',
                data: {
                    ...data,
                    related_products: related_products.docs,
                },
            });
        }

        const dataList = await ProductService.findProductListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product list get successfully',
            data: dataList,
        });
    });
    static updateProductByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ProductService.findProductById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed!',
                'Product not found. Please verify the service ID and try again.',
            );
        }
        await ProductService.updateProductByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product updated successfully',
            data: undefined,
        });
    });
    static deleteProductByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ProductService.deleteProductById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Product deleted successfully',
            data: undefined,
        });
    });
}
