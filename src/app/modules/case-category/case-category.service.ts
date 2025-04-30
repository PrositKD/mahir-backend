import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import CaseCategory from './case-category.model';
export class CaseCategoryService {
    static async postCaseCategoryies(payload: any) {
        const data = await CaseCategory.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new case category ! please try again',
            );
        }
        return data;
    }
    static async findCaseCategoryById(_id: string | Types.ObjectId) {
        const data = await CaseCategory.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Case category not found. please check your case category id and try again',
            );
        }
        return data;
    }
    static async findCaseCategoryByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await CaseCategory.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Case tag not found.',
            );
        }
        return data;
    }
    static async findCaseCategoryListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = CaseCategory.aggregate([
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
        return await CaseCategory.aggregatePaginate(aggregate, options);
    }
    static async updateCaseCategoryByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await CaseCategory.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  case category ! please try again',
            );
        }
        return data;
    }
    static async deleteCaseCategoryById(_id: string | Types.ObjectId) {
        const data = await CaseCategory.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Cate tag not found. please check your case category id and try again',
            );
        }
        return data;
    }
}
