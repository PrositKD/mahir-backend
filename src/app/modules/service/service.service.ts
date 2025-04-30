import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Service from './service.model';

export class ServiceService {
    static async postServiceByPayload(payload: any) {
        const data = await Service.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new service!',
            );
        }
        return data;
    }
    static async findServiceById(_id: string | Types.ObjectId) {
        const data = await Service.findById(_id)
            .populate({ path: 'category', select: 'name' })
            .populate({ path: 'tags', select: 'name' })
            .select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service not found.',
            );
        }
        return data;
    }
    static async findServiceByQuery(
        filter: Record<string, string | boolean | Types.ObjectId>,
        query?: Record<string, string>,
        select?: string | undefined | Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Service.findOne(filter).select(select);
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service not found.',
            );
        }
        return data;
    }
    static async findServiceListByQuery(
        filter: Record<string, string | Types.ObjectId>,
        query: Record<string, string | number>,
        select?: string | undefined | Record<string, string | number>,
        permission: boolean = true,
    ) {
        const aggregate = Service.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'service_categories',
                    localField: 'category',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'service_tags',
                    localField: 'tags',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    as: 'tags',
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
        return await Service.aggregatePaginate(aggregate, options);
    }
    static async updateServiceByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Service.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update service category ! please try again',
            );
        }
        return data;
    }
    static async deleteServiceById(_id: string | Types.ObjectId) {
        const data = await Service.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service not found. Please verify the service ID and try again.!',
            );
        }
        return data;
    }
}
