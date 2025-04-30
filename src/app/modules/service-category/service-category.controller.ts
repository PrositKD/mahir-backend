import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ServiceCategoryService } from './service-category.service';

export class ServiceCategoryController {
    static createServiceCategory = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ServiceCategoryService.findServiceCategoryByQuery(
            {
                name: body.name,
                is_deleted: false,
            },
            {},
            {},
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Service category name already exists',
            );
        }
        await ServiceCategoryService.postCategoryByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Service category created successfully',
            data: undefined,
        });
    });
    static getCategoryListAdmin = catchAsync(async (req, res) => {
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
            const data = await ServiceCategoryService.findServiceCategoryById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Service category name get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            is_deleted: 0,
            updatedAt: 0,
        };
        const catgeory =
            await ServiceCategoryService.findServiceCategoryListByQuery(
                filter,
                query,
                select,
                false,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Service category list get successfully',
            data: catgeory,
        });
    });
    static getCategoryListPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
            status: true,
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`name.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const data = await ServiceCategoryService.findServiceCategoryById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Service category name get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            is_deleted: 0,
            status: 0,
            updatedAt: 0,
        };
        const catgeory =
            await ServiceCategoryService.findServiceCategoryListByQuery(
                filter,
                query,
                select,
                false,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service category list get successfully',
            data: catgeory,
        });
    });
    static updateCategoryByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ServiceCategoryService.findServiceCategoryById(
            body._id,
        );
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed!',
                'Service category not found. Please verify the service category ID and try again.',
            );
        }
        await ServiceCategoryService.updateServiceCategoryByQuery(
            { _id: body._id },
            body,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service category updated successfully',
            data: undefined,
        });
    });
    static deleteCategoryByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const exist = await ServiceCategoryService.findServiceCategoryByQuery(
            { _id: id, is_deleted: true },
            {},
            { _id: 1 },
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed!',
                'Service category already deleted successfully !',
            );
        }
        await ServiceCategoryService.deleteServiceCategoryById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service category deleted successfully',
            data: undefined,
        });
    });
}
