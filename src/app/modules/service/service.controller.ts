import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ServiceService } from './service.service';
import { ObjectId } from 'mongodb';

export class ServiceController {
    static createServiceByPayload = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ServiceService.findServiceByQuery(
            {
                title: body.title,
            },
            {},
            {},
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'This service already exists. Please check your existing services.',
            );
        }
        await ServiceService.postServiceByPayload(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Service created successfully',
            data: undefined,
        });
    });
    static getServiceListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = query.langCode || 'en';
        if (query.search) {
            filter[`title.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }

        if (query._id) {
            const data = await ServiceService.findServiceById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Service get successfully',
                data,
            });
        }
        const select = {
            __v: 0,
            updatedAt: 0,
        };
        const dataList = await ServiceService.findServiceListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service list get successfully',
            data: dataList,
        });
    });
    static getServiceListByPublic = catchAsync(async (req, res) => {
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
            filter['category'] = new ObjectId(query.category);
        }
        if (query._id) {
            const data = await ServiceService.findServiceById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Service  get successfully',
                data,
            });
        }
        const select =
            typeof query.fields === 'string'
                ? query.fields
                      .split(',')
                      .reduce((acc: Record<string, number>, curr: string) => {
                          acc[curr] = 1;
                          return acc;
                      }, {})
                : {
                      __v: 0,
                      status: 0,
                      video_url: 0,
                      banner_image: 0,
                      description: 0,
                      tags: 0,
                      updatedAt: 0,
                  };
        const dataList = await ServiceService.findServiceListByQuery(
            filter,
            query,
            select,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service list get successfully',
            data: dataList,
        });
    });
    static updateServiceByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await ServiceService.findServiceById(body._id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed!',
                'Service not found. Please verify the service ID and try again.',
            );
        }
        await ServiceService.updateServiceByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service updated successfully',
            data: undefined,
        });
    });
    static deleteServiceByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ServiceService.deleteServiceById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Service  deleted successfully',
            data: undefined,
        });
    });
}
