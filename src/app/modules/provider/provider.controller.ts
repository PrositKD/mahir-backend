import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ProviderService } from './provider.service';

export class ProviderController {
    static createProvider = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ProviderService.findProviderByQuery(
            {
                name: body.name,
                is_deleted: false,
            },
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Provider already exists',
            );
        }
        await ProviderService.postProviderByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Provider created successfully',
            data: undefined,
        });
    });
    static getProviderListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
        };
        if (query.search) {
            filter['$or'] = [
                { name: { $regex: new RegExp(query.search, 'i') } },
                { email: { $regex: new RegExp(query.search, 'i') } },
                { phone: { $regex: new RegExp(query.search, 'i') } },
            ];
        }
        if (query._id) {
            const data = await ProviderService.findProviderById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Provider get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            is_deleted: 0,
            updatedAt: 0,
        };
        const dataList = await ProviderService.findProviderListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Provider list get successfully',
            data: dataList,
        });
    });
    static getProviderListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
        };
        if (query.search) {
            filter['$or'] = [
                { name: { $regex: new RegExp(query.search, 'i') } },
                { email: { $regex: new RegExp(query.search, 'i') } },
                { phone: { $regex: new RegExp(query.search, 'i') } },
            ];
        }
        if (query._id) {
            const data = await ProviderService.findProviderById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Provider get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            is_deleted: 0,
            status: 0,
            updatedAt: 0,
        };
        const dataList = await ProviderService.findProviderListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Provider list get successfully',
            data: dataList,
        });
    });
    static updateProviderByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ProviderService.findProviderById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed!',
                'Provider can not found ! please try again .',
            );
        }
        await ProviderService.updateProviderByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Provider updated successfully',
            data: undefined,
        });
    });
    static deleteProviderByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const exist = await ProviderService.findProviderByQuery(
            { _id: id, is_deleted: true },
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed!',
                'Provider already deleted successfully !',
            );
        }
        await ProviderService.deleteProviderById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Provider deleted successfully',
            data: undefined,
        });
    });
}
