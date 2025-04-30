import AppError from '../../errors/AppError';
import Event from './event.model';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';

export class EventService {
    static async postEventByPayload(payload: any) {
        const data = await Event.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new event ! please try again',
            );
        }
        return data;
    }
    static async findEventById(_id: string | Types.ObjectId) {
        const data = await Event.findById(_id)
            .populate({ path: 'category', select: 'name' })
            .select('-updatedAt -__v -status');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Event not found.',
            );
        }
        return data;
    }
    static async findEventByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Event.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Event not found.',
            );
        }
        return data;
    }
    static async findEventListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
        _permission: boolean = true,
    ) {
        const aggregate = Event.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'event_categories',
                    foreignField: '_id',
                    localField: 'category',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                description: 1,
                            },
                        },
                    ],
                    as: 'category',
                },
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        const data = await Event.aggregatePaginate(aggregate, options);
        return data;
    }
    static async findEventCategoryListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = Event.aggregate([
            {
                $match: filter,
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'event_categories',
                    foreignField: '_id',
                    localField: '_id',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                image: 1,
                            },
                        },
                    ],
                    as: 'category',
                },
            },
            {
                $unwind: '$category',
            },
            {
                $project: {
                    _id: 0,
                    category: 1,
                    count: 1,
                },
            },
        ]);
        const options = {
            page: +query.page | 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        const data = await Event.aggregatePaginate(aggregate, options);
        return data;
    }

    static async updateEventByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Event.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Can not update  event ! please try again',
            );
        }
        return data;
    }
    static async deleteEventById(_id: string | Types.ObjectId) {
        const data =
            await Event.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Event not found.',
            );
        }
        return data;
    }
}
