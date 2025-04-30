import { Types } from 'mongoose';

export type TReview = {
    user: Types.ObjectId;
    approve_status: boolean;
    rating: number;
    comment: string | undefined;
};
