import { catchAsync } from '../../utils/catchAsync';
import { ServiceTagService } from './service-tag.service';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';

export class ServiceTagController {
    static createTags = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await ServiceTagService.findServiceTagByQuery(
            {
                name: body.name,
                is_delete: false,
            },
            false,
        );
        if (existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Tag name already exists',
            );
        }
        await ServiceTagService.postServiceTags(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Tag name created successfully',
            data: undefined,
        });
    });
    static getTagListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`name.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const tag = await ServiceTagService.findServiceTagById(query._id);
            if (!tag) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Tag name can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Service tag name get successfully',
                data: tag,
            });
        }
        const tags = await ServiceTagService.findServiceTagListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service tag list get successfully',
            data: tags,
        });
    });
    static updateTagsByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await ServiceTagService.findServiceTagById(body._id);
        if (!existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Tag name not found ! please check your service tag Id and try again .',
            );
        }
        await ServiceTagService.updateServiceTagByQuery(
            { _id: body._id },
            body,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service tag  updated successfully',
            data: undefined,
        });
    });
    static deleteTagsByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ServiceTagService.deleteServiceTagById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service tag  deleted successfully',
            data: undefined,
        });
    });
}
