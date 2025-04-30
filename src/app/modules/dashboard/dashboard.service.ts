import User from '../user/user.model';
import { Types } from 'mongoose';
import EventBooking from '../event-booking/event-booking.model';
import Order from '../order/order.model';
import Support from '../support/support.model';
import JobApply from '../job-apply/job-apply.model';

export class DashboardService {
    static async findDashboard() {
        const aggrigate = await User.aggregate([
            {
                $match: { role: 'user' },
            },
            {
                $count: 'user',
            },
            {
                $lookup: {
                    from: 'services',
                    pipeline: [],
                    as: 'service',
                },
            },
            {
                $lookup: {
                    from: 'events',
                    pipeline: [],
                    as: 'event',
                },
            },
            {
                $lookup: {
                    from: 'events',
                    pipeline: [],
                    as: 'event',
                },
            },
            {
                $lookup: {
                    from: 'jobs',
                    pipeline: [],
                    as: 'job',
                },
            },
            {
                $lookup: {
                    from: 'job_applies',
                    pipeline: [],
                    as: 'job_apply',
                },
            },
            {
                $lookup: {
                    from: 'products',
                    pipeline: [],
                    as: 'product',
                },
            },
            {
                $addFields: {
                    service: { $size: '$service' },
                    event: { $size: '$event' },
                    job: { $size: '$job' },
                    job_apply: { $size: '$job_apply' },
                    product: { $size: '$product' },
                },
            },
        ]);
        return aggrigate;
    }
    static async findDashboardByQuery(
        filter: Record<string, string | Types.ObjectId | number>,
        query: Record<string, number | string | Types.ObjectId>,
        select: Record<string, string | Types.ObjectId | number>,
    ) {
        const event = await EventBooking.aggregate([
            {
                $match: filter,
            },
            {
                $count: 'event',
            },
        ]);
        const order = await Order.aggregate([
            {
                $match: filter,
            },
            {
                $match: {
                    status: 'accepted',
                },
            },
            {
                $count: 'order',
            },
        ]);
        const support = await Support.aggregate([
            {
                $match: filter,
            },
            {
                $count: 'support',
            },
        ]);
        const job_apply = await JobApply.aggregate([
            {
                $match: filter,
            },
            {
                $count: 'job_apply',
            },
        ]);
        return {
            event: event.length ? event[0].event  : 0,
            order: order.length ? order[0].order : 0,
            support: support.length ?  support[0].support : 0,
            job_apply: job_apply.length ?  job_apply[0].job_apply : 0 ,
        };
    }
}
