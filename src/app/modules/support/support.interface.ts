import { Types } from 'mongoose';

export type TSupport = {
    user: Types.ObjectId;
    title: string;
    subject: string;
    priority: number;
    description: string;
};
