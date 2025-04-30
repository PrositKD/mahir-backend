import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { CaseService } from './case.service';
import mongoose from 'mongoose';
export class CaseController {
    static createCases = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await CaseService.findCaseByQuery(
            {
                title: body.title,
            },
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Case study already exists',
            );
        }
        await CaseService.postCaseByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Case study created successfully',
            data: undefined,
        });
    });
    static getCaseListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`$or`] = [
                {
                    [`title.${langCode}`]: {
                        $regex: new RegExp(query.search, 'i'),
                    },
                },
                { [`client`]: { $regex: new RegExp(query.search, 'i') } },
            ];
        }
        if (query._id) {
            const data = await CaseService.findCaseById(query._id);
            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Case can't exists. please check your case study id and try again.",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Case study get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const blog = await CaseService.findCaseListByQuery(
            filter,
            {},
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case study list get successfully',
            data: blog,
        });
    });
    static getCaseListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const langCode = query.langCode || 'en';
        const filter: any = {
            status: true,
        };
        if (query.category) {
            filter[`category`] = new mongoose.Types.ObjectId(query.category);
        }
        if (query.search) {
            filter[`$or`] = [
                {
                    [`title.${langCode}`]: {
                        $regex: new RegExp(query.search, 'i'),
                    },
                },
                { [`client`]: { $regex: new RegExp(query.search, 'i') } },
            ];
        }
        if (query._id) {
            const data = await CaseService.findCaseById(query._id);
            const select = {
                __v: 0,
                description: 0,
                banner_image: 0,
                result: 0,
                status: 0,
                tags: 0,
                updatedAt: 0,
            };
            const related_case_study = await CaseService.findCaseListByQuery(
                { category: data.category._id },
                {},
                select,
                false,
            );

            if (!data) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Case can't exists. please check your case study id and try again.",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Case study get successfully',
                data: {
                    ...data,
                    related_case_study: related_case_study.docs,
                },
            });
        }
        const select = {
            __v: 0,
            description: 0,
            banner_image: 0,
            result: 0,
            status: 0,
            tags: 0,
            updatedAt: 0,
        };
        const dataList = await CaseService.findCaseListByQuery(
            filter,
            {},
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case study list get successfully',
            data: dataList,
        });
    });
    static updateCaseByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await CaseService.findCaseById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Case not found.please check your case study id and try again.',
            );
        }
        await CaseService.updateCaseByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case study updated successfully',
            data: undefined,
        });
    });
    static deleteCaseByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await CaseService.deleteCaseById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Case study deleted successfully',
            data: undefined,
        });
    });
}
