import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import mongoose, { Types } from 'mongoose';
import Review from './review-product.model';
import ProductReview from './review-product.model';

export class ReviewProductService {
    static async createProductReview(payload: any) {
        const data = await ProductReview.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new product review ! please try again',
            );
        }
        return data;
    }
    static async findProductReviewById(_id: string | Types.ObjectId) {
        const data = await ProductReview.findById(_id)
            .populate({
                path: 'user',
                select: 'name image role address country',
            })
            .populate({
                path: 'product',
                select: 'product price thumb_image',
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

    static async findReviewReviewByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await ProductReview.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Review not found. please check your product and try again',
            );
        }
        return data;
    }
    static async findProductReviewsWithPagination(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = ProductReview.aggregate([

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
                $lookup: {
                    from: 'products',
                    foreignField: '_id',
                    localField: 'product',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                quantity:1,
                                price:1,
                                thumb_image: 1,
                                category:1
                            },
                        },
                    ],
                    as: 'product',
                },
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true,
                },
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
        return await ProductReview.aggregatePaginate(aggregate, options);
    }

    static async updateProductReview(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await ProductReview.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  product review! please try again',
            );
        }
        return data;
    }
    static async deleteProductReviewById(_id: string | Types.ObjectId) {
        const data =
            await ProductReview.findByIdAndDelete(_id).select('-updatedAt -__v');
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
