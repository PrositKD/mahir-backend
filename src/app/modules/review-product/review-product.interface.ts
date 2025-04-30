import { Types } from 'mongoose';

export type TProductReview = {
    user: Types.ObjectId;
    product: Types.ObjectId;
    approve_status: boolean;
    rating: number;
    comment: string | undefined;
};
