import { Types } from 'mongoose';

export type TEvent = {
    title: Map<string, string>;
    description: Map<string, string>;
    date: Date;
    start_date: Date;
    end_date: Date;
    location: string;
    payment_type: 'free' | 'paid';
    fee?: {
        amount: number;
        discount_type: 'fixed' | 'percentage';
        discount_amount: number;
    };
    image: string;
    organizer_name: string;
    organizer_image: string;
    organizer_email: string;
    organizer_phone: string;
    status: boolean;
    category: Types.ObjectId;
};
