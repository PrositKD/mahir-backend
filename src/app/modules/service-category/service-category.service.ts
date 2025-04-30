import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import ServiceCategory from './service-category.model';

export class ServiceCategoryService {
    static async postCategoryByPayload(payload: any) {
        const data = await ServiceCategory.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new service category ! please try again',
            );
        }
        return data;
    }
    static async findServiceCategoryById(_id: string | Types.ObjectId) {
        const data = await ServiceCategory.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service category not found.',
            );
        }
        return data;
    }
    static async findServiceCategoryByQuery(
        filter: Record<string, string | boolean | Types.ObjectId>,
        query?: Record<string, string>,
        select?: string | undefined | Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await ServiceCategory.findOne(filter).select(select);
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service category not found.',
            );
        }
        return data;
    }
    static async findServiceCategoryListByQuery(
        filter: Record<string, string | Types.ObjectId>,
        query: Record<string, string | number>,
        select?: string | undefined | Record<string, string | number>,
        permission: boolean = true,
    ) {
        const aggregate = ServiceCategory.aggregate([
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
        return await ServiceCategory.aggregatePaginate(aggregate, options);
    }
    static async updateServiceCategoryByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await ServiceCategory.findOneAndUpdate(
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
    static async deleteServiceCategoryById(_id: string | Types.ObjectId) {
        const data = await ServiceCategory.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        console.log(data);
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service category not found.',
            );
        }
        return data;
    }
}
