import { Types } from 'mongoose';

export type TOrder = {
    orderId: string;
    product?: Types.ObjectId;
    amount: number;
    name: number;
    image: string;
    status: 'pending' | 'accepted' | 'cancelled';
    payment: Types.ObjectId;
    user: Types.ObjectId;
};
