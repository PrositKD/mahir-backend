import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Support from './support.model';

export class SupportService {
    static async postSupportByPayload(payload: any) {
        const data = await Support.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new support ! please try again',
            );
        }
        return data;
    }
    static async findSupportById(_id: string | Types.ObjectId) {
        const data = await Support.findById(_id)
            .populate({ path: 'user', select: 'name role image' })
            .select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Support ticket not found. please check support id and try again',
            );
        }
        return data;
    }
    static async findSupportByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Support.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Support ticket not found.',
            );
        }
        return data;
    }
    static async findSupportListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
        _permission: boolean = true,
    ) {
        const aggregate = Support.aggregate([
            {
                $match: filter,
            },
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
                                role: 1,
                                image: 1,
                                email: 1,
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
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        const data = await Support.aggregatePaginate(aggregate, options);
        return data;
    }

    static async deleteSuppostById(_id: string | Types.ObjectId) {
        const data =
            await Support.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Support ticket not found. please check support id and try again.',
            );
        }
        return data;
    }
}
