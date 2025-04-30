import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { JobApplyService } from './job-apply.service';
import mongoose from 'mongoose';
import appError from '../../errors/AppError';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export class JobApplyController {
    static createJobApply = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        const exist = await JobApplyService.findJobApplyByQuery({
            user: user,
            job: body.job,
        } , false);
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Already applied this job',
            );
        }
        await JobApplyService.postJobApplyByPayload({
            ...body,
            user: user._id,
        });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Job application submitted successfully',
            data: undefined,
        });
    });
    static getJobApplyListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.search) {
            filter[`$or`] = [
                { full_name: { $regex: new RegExp(query.search, 'i') } },
                { email: { $regex: new RegExp(query.search, 'i') } },
                { phone: { $regex: new RegExp(query.search, 'i') } },
            ];
        }
        if (query._id) {
            const data = await JobApplyService.findJobApplyById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Job application get successfully',
                data,
            });
        }
        const select = {
            updatedAt: 0,
            __v: 0,
        };
        const dataList = await JobApplyService.findApplyJobListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job application list get successfully',
            data: dataList,
        });
    });
    static getJobApplyListByUser = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { user } = res.locals;
        const filter: any = {
            user: new mongoose.Types.ObjectId(user._id),
        };
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`$or`] = [
                { full_name: { $regex: new RegExp(query.search, 'i') } },
                { email: { $regex: new RegExp(query.search, 'i') } },
                { phone: { $regex: new RegExp(query.search, 'i') } },
                {
                    [`job.title.${langCode}`]: {
                        $regex: new RegExp(query.search, 'i'),
                    },
                },
                {
                    [`job.company_name`]: {
                        $regex: new RegExp(query.search, 'i'),
                    },
                },
            ];
        }
        if (query._id) {
            const data = await JobApplyService.findJobApplyById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Job application get successfully',
                data,
            });
        }
        const select = {
            updatedAt: 0,
            __v: 0,
        };
        const dataList = await JobApplyService.findApplyJobListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job application list get successfully',
            data: dataList,
        });
    });
    static deleteJobApply = catchAsync(async (req, res) => {
        const { id } = req.params;
        const { user } = res.locals;
        const jobApply = await JobApplyService.findJobApplyById(id);
        if (
            user.role === 'user' &&
            jobApply.user.toString() != user._id.toString()
        ) {
            new appError(
                httpStatus.BAD_REQUEST,
                'Request failed !',
                "Can't permission to delete job apply",
            );
        }
        await JobApplyService.deleteJobApplyById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Job application deleted successfully',
            data: undefined,
        });
    });
}
