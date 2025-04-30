import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import JobCategory from './job-category.model';

export class JobCategoryService {
    static async postJobCategoryByPayload(payload: any) {
        const data = await JobCategory.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new job category ! please check your credentials and try again',
            );
        }
        return data;
    }
    static async findJobCategoryById(_id: string | Types.ObjectId) {
        const data = await JobCategory.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job category not found. Please check job category Id and try again',
            );
        }
        return data;
    }
    static async findJobCategoryByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await JobCategory.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job category not found !',
            );
        }
        return data;
    }
    static async findJobCategoryListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = JobCategory.aggregate([
            {
                $match: filter,
            },
            {
                $project: {
                    is_deleted: 0,
                    __v: 0,
                    updatedAt: 0,
                },
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await JobCategory.aggregatePaginate(aggregate, options);
    }
    static async updateJobCategoryByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await JobCategory.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not updated  blog category ! please try again',
            );
        }
        return data;
    }
    static async deleteJobCategoryById(_id: string | Types.ObjectId) {
        const data = await JobCategory.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Job category not found ! please check job category Id and try again',
            );
        }
        return data;
    }
}
