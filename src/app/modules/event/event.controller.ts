import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import mongoose, { Types } from 'mongoose';
import { EventService } from './event.service';
import { EventBookingSevice } from '../event-booking/event-booking.sevice';
import { PaymentService } from '../payment/payment.service';
import { generateTransactionID } from '../../utils/helpers';
import Payment from '../payment/payment.model';
import {
    executePaypelPayment,
    executeRazorpayPayment,
    executeStripePayment,
    paypalPaymentInfoDB,
    razorpayPaymentInfoBD,
    stripePaymentInfoDB,
} from '../payment/payment.utils';
import httpStatus from 'http-status';
import { OrderService } from '../order/order.service';
import EventBooking from '../event-booking/event-booking.model';
export class EventController {
    static createEventPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        const exist = await EventService.findEventByQuery(
            {
                title: body.title,
            },
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Event already exists! please try again.',
            );
        }
        if (body.payment_type === 'paid') {
            if (body.fee.amount < body.fee.discount) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    'Discount should be less than event amount! please try again.',
                );
            }
        }
        await EventService.postEventByPayload({ ...body, author: user._id });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Event created successfully',
            data: undefined,
        });
    });
    static createEventPaymentPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        let data = null;
        const event = await EventService.findEventById(body.event);
        if (event.payment_type == 'free') {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                "Payment type 'free' is not allowed !",
            );
        }
        const existBooking = await EventBookingSevice.findEventBookingByQuery(
            { _id: event._id, status: 'accepted' },
            {},
            '',
            false,
        );
        if (existBooking) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Already booked this event!',
            );
        }
        const eventFee =
            event.fee.discount_type == 'fixed'
                ? event.fee.amount - event.fee.discount_amount
                : (event.fee.amount * event.fee.discount_amount) / 100;
        const payment = await PaymentService.createPaymentByPayload({
            user: user._id,
            payment_type: 'event',
            method: body.method,
            status: 'pending',
            transaction_id: await generateTransactionID('C', Payment),
            amount: eventFee,
        });
        const booking = await EventBookingSevice.createEventBookingByPayload({
            user: user._id,
            event: event._id,
            amount: eventFee,
            status: 'pending',
            payment: payment._id,
        });
        const payload: {
            amount: number;
            payment_type: string;
            booking_id: Types.ObjectId;
        } = {
            amount: eventFee,
            payment_type: 'booking',
            booking_id: booking._id,
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
                "Payment method doesn't exist!",
            );
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Your payment is processing',
            data,
        });
    });
    static conformEventPayment = catchAsync(async (req, res) => {
        const { body }: any = req.body;
        if (body?.method === 'stripe') {
            if (!body.session) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed',
                    'session is required for stripe payment',
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
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Payment successful',
            data: undefined,
        });
    });
    static updateEventBooking = catchAsync(async (req, res) => {
        const { body }: any = req.body;
        await EventBookingSevice.findEventBookingById(body._id);
        await EventBookingSevice.updateEventBookingByQuery(
            {_id: body._id },
            body
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Event Booking updated successfully',
            data: undefined,
        });
    });
    static getEventBooking = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const { user } = res.locals;
        if (user.role == 'user') {
            filter['user'] = new mongoose.Types.ObjectId(user._id);
        }
        if (query.event ) {
            filter['event'] = new mongoose.Types.ObjectId(query.event);
        }
        if (query.status) {
            filter['status'] = query.status;
        }

        if (query.search) {
            filter[`$or`] = [
                { ticket: { $regex: new RegExp(query.search, 'i') } },
            ];
        }
        if (query._id) {
            const data = await EventBookingSevice.findEventBookingById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Event booking get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList =
            await EventBookingSevice.findEventBookingsWithPagination(
                filter,
                query,
                select,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Event booking list get successfully',
            data: dataList,
        });
    });
    static getEventListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const data = await EventService.findEventById(query._id);
            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Event can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Event get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const blog = await EventService.findEventListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Event list get successfully',
            data: blog,
        });
    });
    static getEventListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
        };
        const langCode = query.langCode || 'en';
        if (query.is_latest) {
            filter['is_latest'] = query.is_latest === 'true';
        }
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query.category) {
            filter['category'] = new mongoose.Types.ObjectId(query.category);
        }
        if (query._id) {
            const data = await EventService.findEventById(query._id);
            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Event can't exists! please try again.",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Event get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
            status: 0,
        };
        const event = await EventService.findEventListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Event list get successfully',
            data: event,
        });
    });
    static updateEventByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        await EventService.findEventById(body._id);
        await EventService.updateEventByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Event updated successfully',
            data: undefined,
        });
    });
    static deleteEventByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await EventService.deleteEventById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Event deleted successfully',
            data: undefined,
        });
    });
}
