import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ObjectId } from 'mongodb';
import { SupportService } from './support.service';

export class SupportController {
    static createSupportByPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        await SupportService.postSupportByPayload({ ...body, user: user._id });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Support ticket created successfully',
            data: undefined,
        });
    });
    static getSupportListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.search) {
            filter[`title`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }

        if (query._id) {
            const data = await SupportService.findSupportById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Support ticket get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await SupportService.findSupportListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Support list get successfully',
            data: dataList,
        });
    });
    static getSupportListByUser = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { user } = res.locals;
        const filter: any = {
            user: new ObjectId(user._id),
        };
        if (query.search) {
            filter[`title`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        if (query.category) {
            filter['category'] = new ObjectId(query.category);
        }
        if (query._id) {
            const data = await SupportService.findSupportById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Support thicket  get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await SupportService.findSupportListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Support list get successfully',
            data: dataList,
        });
    });
    static deleteServiceByAdminAndUser = catchAsync(async (req, res) => {
        const { id } = req.params;
        const { user } = res.locals;
        const data = await SupportService.findSupportById(id);
        if (
            user.role == 'user' &&
            user._id.toString() != data.user._id.toString()
        ) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'This Support ticket can not deleted. Support ticket is not yours',
            );
        }
        await SupportService.deleteSuppostById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Support ticket deleted successfully',
            data: undefined,
        });
    });
}
