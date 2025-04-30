import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Job from './job.model';
import Event from '../event/event.model';

export class JobService {
    static async postJobByPayload(payload: any) {
        const data = await Job.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new job ! please try again',
            );
        }
        return data;
    }
    static async findJobById(_id: string | Types.ObjectId) {
        const data = await Job.findById(_id)
            .populate({ path: 'category', select: 'name' })
            .select('-updatedAt -__v -status');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job not found.please check your job id and try again',
            );
        }
        return data;
    }
    static async findjobByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Job.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job not found. please check your job and try again',
            );
        }
        return data;
    }
    static async findJobListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
        _permission: boolean = true,
    ) {
        const aggregate = Job.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'job_categories',
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
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        const data = await Job.aggregatePaginate(aggregate, options);
        return data;
    }
    static async findJobCategoryListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = Job.aggregate([
            {
                $match: filter,
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'job_categories',
                    foreignField: '_id',
                    localField: '_id',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
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
                $project: {
                    _id: 0,
                    category: 1,
                    count: 1,
                },
            },
        ]);
        const options = {
            page: +query.page | 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        const data = await Job.aggregatePaginate(aggregate, options);
        return data;
    }

    static async updateJobByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Job.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  job ! please try again',
            );
        }
        return data;
    }
    static async deleteJobById(_id: string | Types.ObjectId) {
        const data = await Job.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job not found. please check your job id and try again',
            );
        }
        return data;
    }
}
