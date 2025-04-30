import Order from './order.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';

export class OrderService {
    static async createOrder(payload: any) {
        const data = await Order.create(payload);
        if (!data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request failed',
                'Order not created .please check your payload and try again',
            );
        }
        return data;
    }
    static async findOrderById(_id: Types.ObjectId | string) {
        const data = await Order.findById(_id)
            .populate({
                path: 'product',
                select: 'productId thumb_image category',
            })
            .populate({ path: 'user', select: 'name image role' })
            .populate({
                path: 'payment',
                select: 'payment_type method status transaction_id',
            })
            .select('-__v -updatedAt');
        if (!data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request failed',
                'Order not found .please check your order id and try again',
            );
        }
        return data;
    }
    static async findOrderByQuery(
        query: Record<string, string | Types.ObjectId | number>,
        permission: boolean = true,
    ) {
        const data = await Order.findOne(query).select('-__v -updatedAt');
        if (!data && permission) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request failed',
                'Order not found .please check your order credential  and try again',
            );
        }
        return data;
    }
    static async findOrdersWithPagination(
        filter: Record<string, string | Types.ObjectId | number>,
        query: Record<string, number | string | Types.ObjectId>,
        select: Record<string, string | Types.ObjectId | number>,
    ) {
        const aggregate = Order.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                thumb_image: 1,
                                category: 1,
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
                $lookup: {
                    from: 'project_categories',
                    localField: 'product.category',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    as: 'product.category',
                },
            },
            {
                $unwind: {
                    path: '$product.category',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                image: 1,
                                role: 1,
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
                $lookup: {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                payment_type: 1,
                                method: 1,
                                status: 1,
                                transaction_id: 1,
                            },
                        },
                    ],
                    as: 'payment',
                },
            },
            {
                $unwind: {
                    path: '$payment',
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
        return await Order.aggregatePaginate(aggregate, options);
    }
    static async updateOrder(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Order.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'The requested order could not be updated. Please try again later',
            );
        }
        return data;
    }
}
