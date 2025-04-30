import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { CaseTagService } from './case-tag.service';

export class CaseTagController {
    static createCaseTagbyPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await CaseTagService.findCaseTagByQuery(
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
                'Case tag name already exists',
            );
        }
        await CaseTagService.postCaseTags(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Case tag created successfully',
            data: undefined,
        });
    });
    static getCaseTagListByAdmin = catchAsync(async (req, res) => {
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
            const tag = await CaseTagService.findCaseTagById(query._id);
            if (!tag) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Case tag can't exists ! please check your case tag",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Case tag get successfully',
                data: tag,
            });
        }
        const tags = await CaseTagService.findCaseTagListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Case tag list get successfully',
            data: tags,
        });
    });
    static updateCaseTagsByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await CaseTagService.findCaseTagById(body._id);
        if (!existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Case tag name not found. please check your case tag id and try again',
            );
        }
        await CaseTagService.updateCaseTagByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case tag  updated successfully',
            data: undefined,
        });
    });
    static deleteCaseTagsByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await CaseTagService.deleteCaseTagById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case tag deleted successfully',
            data: undefined,
        });
    });
}
