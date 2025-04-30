import { model, Schema } from 'mongoose';

import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TProductReview } from './review-product.interface';

const schema = new Schema<TProductReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        product:{
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: [true , "product is required"],
        },
        approve_status: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            required: [true, 'Review rating should be required'],
            min: [1, 'Review rating must be greater than or equal 1'],
            max: [5, 'Review rating must be less than or equal 1'],
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);
schema.plugin(aggregatePaginate);
const ProductReview = model<TProductReview, any>('product_review', schema);
export default ProductReview;
