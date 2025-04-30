import { Types } from 'mongoose';

export type TPayment = {
    user: Types.ObjectId;
    method: string;
    status: 'pending' | 'completed' | 'failed';
    payment_type: 'event' | 'product';
    transaction_id: string;
    invoice?: string;
    amount: number;
};
