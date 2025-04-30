import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import mongoose, { Types } from 'mongoose';
import Review from './review.model';

export class ReviewService {
    static async postReviewByPayload(payload: any) {
        const data = await Review.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new review ! please try again',
            );
        }
        return data;
    }
    static async findReviewById(_id: string | Types.ObjectId) {
        const data = await Review.findById(_id)
            .populate({
                path: 'user',
                select: 'name image role address country',
            })
            .select('-updatedAt -__v -approve_status');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Review not found. please check your review id and try again',
            );
        }
        return data;
    }
    static async findReviewByUser(
        user: string | Types.ObjectId,
        permission: boolean = true,
    ) {
        const data = await Review.findOne({
            user: new mongoose.Types.ObjectId(user),
        })
            .populate({
                path: 'user',
                select: 'name image role address country',
            })
            .select('-updatedAt -__v -approve_status');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Review not found. please check your review and try again',
            );
        }
        return data;
    }
    static async findReviewByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Review.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Review not found. please check your job and try again',
            );
        }
        return data;
    }
    static async findReviewListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
        _permission: boolean = true,
    ) {
        const aggregate = Review.aggregate([

            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                image: 1,
                                role: 1,
                                country: 1,
                                address: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: filter,
            },
            {
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Review.aggregatePaginate(aggregate, options);
    }

    static async updateReviewByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Review.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  review! please try again',
            );
        }
        return data;
    }
    static async deleteReviewById(_id: string | Types.ObjectId) {
        const data =
            await Review.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Review not found. please check your review id and try again',
            );
        }
        return data;
    }
}
