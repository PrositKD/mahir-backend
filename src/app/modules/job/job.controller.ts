import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { JobService } from './job.service';
import mongoose from 'mongoose';

export class JobController {
    static createCategoryByPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await JobService.findjobByQuery(
            {
                title: body.title,
            },
            false,
        );
        if (data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Job post already exists',
            );
        }
        await JobService.postJobByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Job created successfully',
            data: undefined,
        });
    });
    static getJobListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query._id) {
            const data = await JobService.findJobById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Job get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await JobService.findJobListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job list get successfully',
            data: dataList,
        });
    });
    static getJobListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query.category) {
            filter[`category`] = new mongoose.Types.ObjectId(query.category);
        }
        if (query._id) {
            const data = await JobService.findJobById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Job get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
            vacancy: 0,
            // job_context: 0,
            job_responsibility: 0,
            educational_requirement: 0,
            experience_requirement: 0,
            additional_requirements: 0,
            salary: 0,
            status: 0,
            author_name: 0,
        };
        const dataList = await JobService.findJobListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job list get successfully',
            data: dataList,
        });
    });
    static updateJobCategoryByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        await JobService.findJobById(body._id);

        await JobService.updateJobByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job  updated successfully',
            data: undefined,
        });
    });
    static deleteJobCategoryByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await JobService.deleteJobById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job  deleted successfully',
            data: undefined,
        });
    });
}
