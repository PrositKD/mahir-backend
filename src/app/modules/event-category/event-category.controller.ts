import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { EventCategoryService } from './event-category.service';
import { EventService } from '../event/event.service';

export class EventCategoryController {
    static createEventCategory = catchAsync(async (req, res) => {
        const { body } = req.body;
        const exist = await EventCategoryService.findEventCategoryByQuery(
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
                'Event category name already exists',
            );
        }
        await EventCategoryService.postEventCategoryies(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Event category created successfully',
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
            const data = await EventCategoryService.findEventCategoryById(
                query._id,
            );

            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Event get successfully',
                data,
            });
        }
        const catgeory =
            await EventCategoryService.findEventCategoryListByQuery(
                filter,
                query,
                false,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Event category list get successfully',
            data: catgeory,
        });
    });
    static getCategoryListByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const data = await EventService.findEventCategoryListByQuery(
            {},
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Event category list get successfully',
            data: data,
        });
    });
    static updateCategoryByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        console.log(req.body);
        const exist = await EventCategoryService.findEventCategoryById(
            body._id,
        );
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Event category not found !',
            );
        }
        await EventCategoryService.updateEventCategoryByQuery(
            { _id: body._id },
            body,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Event category updated successfully',
            data: undefined,
        });
    });
    static deleteCategoryByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const exist = await EventCategoryService.findEventCategoryById(id);
        if (!exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Event category not found !',
            );
        }
        await EventCategoryService.deleteEventCategoryById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Event category deleted successfully',
            data: undefined,
        });
    });
}
