import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import JobApply from './job-apply.model';

export class JobApplyService {
    static async postJobApplyByPayload(payload: any) {
        const data = await JobApply.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new job apply! please try again',
            );
        }
        return data;
    }
    static async findJobApplyById(_id: string | Types.ObjectId) {
        const data = await JobApply.findById(_id)
            .populate({
                path: 'job',
                select: 'title job_position company_name',
            })
            .populate({ path: 'user', select: 'name image address role' })
            .select('-updatedAt -__v -status');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job Apply not found. Please check your Apply job id and try again',
            );
        }
        return data;
    }
    static async findJobApplyByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await JobApply.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job apply not found. please check your job and try again',
            );
        }
        return data;
    }
    static async findApplyJobListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
        _permission: boolean = true,
    ) {
        const aggregate = JobApply.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    foreignField: '_id',
                    localField: 'job',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                job_position: 1,
                                company_name: 1,
                            },
                        },
                    ],
                    as: 'job',
                },
            },
            {
                $unwind: {
                    path: '$job',
                    preserveNullAndEmptyArrays: true,
                },
            },
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
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await JobApply.aggregatePaginate(aggregate, options);
    }

    static async deleteJobApplyById(_id: string | Types.ObjectId) {
        const data =
            await JobApply.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job apply not found. please check your job id and try again',
            );
        }
        return data;
    }
}
