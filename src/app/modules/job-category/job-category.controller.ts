import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { JobCategoryService } from './job-category.service';
import { JobService } from '../job/job.service';
import { JobApplyService } from '../job-apply/job-apply.service';

export class JobCategoryController {
    static createJobCategoryByPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await JobCategoryService.findJobCategoryByQuery(
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
                'Job category name already exists',
            );
        }
        await JobCategoryService.postJobCategoryByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Job category created successfully',
            data: undefined,
        });
    });
    static getCategoryListByAdmin = catchAsync(async (req, res) => {
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
            const data = await JobCategoryService.findJobCategoryById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Job category get successfully',
                data,
            });
        }
        const dataList = await JobCategoryService.findJobCategoryListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job category list get successfully',
            data: dataList,
        });
    });
    static getCategoryListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};

        const dataList = await JobService.findJobCategoryListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job category list get successfully',
            data: dataList,
        });
    });
    static updateJobCategoryByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        await JobCategoryService.findJobCategoryById(body._id);

        await JobCategoryService.updateJobCategoryByQuery(
            { _id: body._id },
            body,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job category updated successfully',
            data: undefined,
        });
    });
    static deleteJobCategoryByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await JobCategoryService.deleteJobCategoryById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job category deleted successfully',
            data: undefined,
        });
    });
}
