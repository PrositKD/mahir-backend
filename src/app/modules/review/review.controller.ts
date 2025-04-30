import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import mongoose from 'mongoose';
import { ReviewService } from './review.service';

export class ReviewController {
    static createReviewByPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        const data = await ReviewService.findReviewByUser(user._id, false);
        if (data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'You have already submitted a review.',
            );
        }
        await ReviewService.postReviewByPayload({ ...body, user: user._id });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message:
                'Review submitted successfully. Thank you for your feedback!',
            data: undefined,
        });
    });
    static getReviewListByAdmin = catchAsync(async (req, res) => {
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
            const data = await ReviewService.findReviewById(query._id);
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
        const dataList = await ReviewService.findReviewListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review list get successfully',
            data: dataList,
        });
    });
    static getReviewListByPublic = catchAsync(async (req, res) => {
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
        if (query._id) {
            const data = await ReviewService.findReviewById(query._id);
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
        const dataList = await ReviewService.findReviewListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review list get successfully',
            data: dataList,
        });
    });
    static updateReviewByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        await ReviewService.findReviewById(body._id);
        await ReviewService.updateReviewByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review updated successfully',
            data: undefined,
        });
    });
    static deleteReviewByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const { user } = res.locals;
        const review = await ReviewService.findReviewById(id);
        if (
            user.role === 'user' &&
            review.user._id.toString() != user._id.toString()
        ) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'You can only modify your own reviews.',
            );
        }

        await ReviewService.deleteReviewById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Review  deleted successfully',
            data: undefined,
        });
    });
}
