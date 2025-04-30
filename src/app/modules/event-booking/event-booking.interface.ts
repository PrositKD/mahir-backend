import { Types } from 'mongoose';

export type TEventBooking = {
    user: Types.ObjectId;
    payment: Types.ObjectId;
    event: Types.ObjectId;
    amount: number;
    ticket: string;
    status: 'active' | 'cancelled' | 'pending';
};
