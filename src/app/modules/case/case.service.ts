import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Case from './case.model';

export class CaseService {
    static async postCaseByPayload(payload: any) {
        const data = await Case.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new case ! please try again',
            );
        }
        return data;
    }
    static async findCaseById(_id: string | Types.ObjectId) {
        const data = await Case.findById(_id)
            .populate({ path: 'category', select: 'name' })
            .populate({ path: 'tags', select: 'name' })
            .select('-updatedAt -__v')
            .lean();

        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Case not found. please check your case study id and try again',
            );
        }
        return data;
    }
    static async findCaseByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Case.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Case not found. please check your case study credential and try again',
            );
        }
        return data;
    }
    static async findCaseListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
        _permission: boolean = true,
    ) {
        const aggregate = Case.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'case_categories',
                    foreignField: '_id',
                    localField: 'category',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                description: 1,
                            },
                        },
                    ],
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
                    from: 'case_tags',
                    foreignField: '_id',
                    localField: 'tags',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
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
        return await Case.aggregatePaginate(aggregate, options);
    }

    static async updateCaseByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Case.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update case study ! please try again',
            );
        }
        return data;
    }
    static async deleteCaseById(_id: string | Types.ObjectId) {
        const data =
            await Case.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Case not found. please check your case study id and try again',
            );
        }
        return data;
    }
}
