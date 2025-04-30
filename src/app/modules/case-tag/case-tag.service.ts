import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import CaseTag from './case-tag.model';
export class CaseTagService {
    static async postCaseTags(payload: any) {
        const data = await CaseTag.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new case tag ! please try again',
            );
        }
        return data;
    }
    static async findCaseTagById(_id: string | Types.ObjectId) {
        const data = await CaseTag.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Case tag not found. please check your case tag id and try again',
            );
        }
        return data;
    }
    static async findCaseTagByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await CaseTag.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Case  tag not found. please check your case credential and try again',
            );
        }
        return data;
    }
    static async findCaseTagListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = CaseTag.aggregate([
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
        return await CaseTag.aggregatePaginate(aggregate, options);
    }
    static async updateCaseTagByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await CaseTag.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  blog tag ! please try again',
            );
        }
        return data;
    }
    static async deleteCaseTagById(_id: string | Types.ObjectId) {
        const data = await CaseTag.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Case tag not found. please check your case id and try again',
            );
        }
        return data;
    }
}
