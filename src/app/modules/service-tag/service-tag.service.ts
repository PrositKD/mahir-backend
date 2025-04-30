import { Types } from 'mongoose';
import Tag from './service-tag.model';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import ServiceTag from './service-tag.model';
export class ServiceTagService {
    static async postServiceTags(payload: any) {
        const data = await ServiceTag.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new service tag ! please try again',
            );
        }
        return data;
    }
    static async findServiceTagById(_id: string | Types.ObjectId) {
        const data = await ServiceTag.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service tag not found. Please check your service tag ! please try again  ',
            );
        }
        return data;
    }
    static async findServiceTagByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await ServiceTag.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service tag not found. Please check your  tag credentials and try again',
            );
        }
        return data;
    }
    static async findServiceTagListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = Tag.aggregate([
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
        return await ServiceTag.aggregatePaginate(aggregate, options);
    }
    static async updateServiceTagByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await ServiceTag.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  service tag ! please try again',
            );
        }
        return data;
    }
    static async deleteServiceTagById(_id: string | Types.ObjectId) {
        const data = await ServiceTag.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service tag not found . please check your service tag Id ! please try again',
            );
        }
        return data;
    }
}
