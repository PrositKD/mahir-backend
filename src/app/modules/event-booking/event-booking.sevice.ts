import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import EventBooking from './event-booking.model';
import { Types } from 'mongoose';
import Order from '../order/order.model';

export class EventBookingSevice {
    static createEventBookingByPayload = async (payload: any) => {
        const event = await EventBooking.create(payload);
        if (!event) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed !',
                'Event booking Request Failed ! Please try again later',
            );
        }
        return event;
    };
    static findEventBookingById = async (_id: string | Types.ObjectId) => {
        const data = await EventBooking.findById(_id).lean();
        if (!data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed !',
                'Event booking Request Failed !  Please check your event booking id and try again',
            );
        }
    };
    static findEventBookingByQuery = async (
        filter: any,
        query: Record<string, string | boolean | Types.ObjectId>,
        select: string,
        permission: boolean = true,
    ) => {
        const data = await EventBooking.findOne(filter).select(select);
        if (!data && permission) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed !',
                'Event booking Request Failed ! Please try again later',
            );
        }
        return data;
    };
    static findEventBookingsWithPagination = async (
        filter: Record<string, string | Types.ObjectId | number>,
        query: Record<string, number | string | Types.ObjectId>,
        select: Record<string, string | Types.ObjectId | number>,
    ) => {
        const aggregate = EventBooking.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'event',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                title: 1,
                                date: 1,
                                start_date: 1,
                                end_date: 1,
                                location: 1,
                                payment_type: 1,
                                fee: 1,
                                image: 1,
                                category: 1,
                            },
                        },
                    ],
                    as: 'event',
                },
            },
            {
                $unwind: {
                    path: '$event',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'event_categories',
                    localField: 'event.category',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    as: 'event.category',
                },
            },
            {
                $unwind: {
                    path: '$event.category',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                image: 1,
                                role: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                payment_type: 1,
                                method: 1,
                                status: 1,
                                transaction_id: 1,
                            },
                        },
                    ],
                    as: 'payment',
                },
            },
            {
                $unwind: {
                    path: '$payment',
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
        return await EventBooking.aggregatePaginate(aggregate, options);
    };

    static updateEventBookingByQuery = async (
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) => {
        const options = {
            new: true,
            session,
        };
        const data = await EventBooking.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    };
}
