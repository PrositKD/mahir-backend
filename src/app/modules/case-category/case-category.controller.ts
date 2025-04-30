import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { CaseCategoryService } from './case-category.service';

export class CaseCategoryController {
    static createCaseCategory = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await CaseCategoryService.findCaseCategoryByQuery(
            {
                name: body.name,
                is_deleted: false,
            },
            false,
        );
        if (data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Case category name already exists',
            );
        }
        await CaseCategoryService.postCaseCategoryies(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Case category created successfully',
            data: undefined,
        });
    });
    static getCategoryList = catchAsync(async (req, res) => {
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
            const data = await CaseCategoryService.findCaseCategoryById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Case category get successfully',
                data,
            });
        }
        const data = await CaseCategoryService.findCaseCategoryListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case catgeory list get successfully',
            data,
        });
    });
    static updateCaseCatgeoyByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await CaseCategoryService.findCaseCategoryById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Case category not found !',
            );
        }
        await CaseCategoryService.updateCaseCategoryByQuery(
            { _id: body._id },
            body,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case category updated successfully',
            data: undefined,
        });
    });
    static deleteCategoryByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await CaseCategoryService.deleteCaseCategoryById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case category deleted successfully',
            data: undefined,
        });
    });
}
