import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import mongoose from 'mongoose';
import { ReviewProductService } from './review-product.service';
import ProductReview from './review-product.model';

export class ReviewProductController {
    static createProductReview = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        await ReviewProductService.createProductReview({ ...body, user: user._id });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Review submitted successfully. Thank you for your feedback!',
            data: undefined,
        });
    });
    static getProductReviewListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const { user } = res.locals;
        if(query.search) {
            filter['user.name'] = { $regex: new RegExp(query.search, 'i') };
        }
        if (user.role === 'user') {
            filter['user._id'] = new mongoose.Types.ObjectId(user._id);
        }
        if (query._id) {
            const data = await ReviewProductService.findProductReviewById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Review get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await ReviewProductService.findProductReviewsWithPagination(
            filter,
            query,
            select
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review list get successfully',
            data: dataList,
        });
    });
    static getProductReviewListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            approve_status: true,
        };
        if(query.search) {
            filter['user.name'] = { $regex: new RegExp(query.search, 'i') };
        }
        if (query.user) {
            filter[`user._id`] = new mongoose.Types.ObjectId(query.user);
        }
        if (query.product) {
            filter[`product`] = new mongoose.Types.ObjectId(query.product);
        }
        if (query._id) {
            const data = await ReviewProductService.findProductReviewById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Review get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
            approve_status: 0,
        };
        const dataList = await ReviewProductService.findProductReviewsWithPagination(
            filter,
            query,
            select
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review list get successfully',
            data: dataList,
        });
    });
    static updateProductReviewByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        await ReviewProductService.findProductReviewById(body._id);
        await ReviewProductService.updateProductReview({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review updated successfully',
            data: undefined,
        });
    });
    static deleteProductReviewByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ReviewProductService.findProductReviewById(id);
        await ReviewProductService.deleteProductReviewById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review deleted successfully',
            data: undefined,
        });
    });
}
