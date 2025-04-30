import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Provider from './provider.model';

export class ProviderService {
    static async postProviderByPayload(payload: any) {
        const data = await Provider.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new provider ! please try again',
            );
        }
        return data;
    }
    static async findProviderById(_id: string | Types.ObjectId) {
        const data = await Provider.findById(_id)
            .populate({ path: 'expert', select: 'name' })
            .select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Provider not found.',
            );
        }
        return data;
    }
    static async findProviderByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Provider.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'provider not found.',
            );
        }
        return data;
    }
    static async findProviderListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
        _permission: boolean = true,
    ) {
        const aggregate = Provider.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'service_categories',
                    foreignField: '_id',
                    localField: 'expert',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                description: 1,
                            },
                        },
                    ],
                    as: 'expert',
                },
            },
            {
                $unwind: {
                    path: '$expert',
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
        const data = await Provider.aggregatePaginate(aggregate, options);
        return data;
    }

    static async updateProviderByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Provider.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  provider ! please try again',
            );
        }
        return data;
    }
    static async deleteProviderById(_id: string | Types.ObjectId) {
        const data = await Provider.findOneAndUpdate(
            { _id },
            { is_deleted: true },
        ).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Provider  not found.',
            );
        }
        return data;
    }
}
