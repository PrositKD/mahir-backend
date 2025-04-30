import { catchAsync } from '../../utils/catchAsync';
import { BlogTagService } from './blog-tag.service';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';

export class BlogTagController {
    static createTags = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await BlogTagService.findBlogTagByQuery(
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
                'Tag name already exists',
            );
        }
        await BlogTagService.postBlogTags(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Tag name created successfully',
            data: undefined,
        });
    });
    static getTagListByAdmin = catchAsync(async (req, res) => {
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
            const tag = await BlogTagService.findBlogTagById(query._id);
            if (!tag) {
                throw new AppError(
                    HttpStatusCode.BadRequest,
                    'Request Failed !',
                    "Tag name can't exists",
                );
            }
            sendResponse(res, {
                statusCode: HttpStatusCode.Created,
                success: true,
                message: 'Tag name get successfully',
                data: tag,
            });
        }
        const tags = await BlogTagService.findBlogTagListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Tag name list get successfully',
            data: tags,
        });
    });
    static updateTagsByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        const existTeg = await BlogTagService.findBlogTagById(body._id);
        if (!existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Tag name not found !',
            );
        }
        await BlogTagService.updateBlogTagByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Tag name updated successfully',
            data: undefined,
        });
    });
    static deleteTagsByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        const existTeg = await BlogTagService.findBlogTagById(id);
        if (!existTeg) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed !',
                'Tag name not found !',
            );
        }
        await BlogTagService.deleteBlogTagById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Tag name deleted successfully',
            data: undefined,
        });
    });
}
