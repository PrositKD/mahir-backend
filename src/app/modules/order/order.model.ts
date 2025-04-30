import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TOrder>(
    {
        orderId: {
            type: String,
            index: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
        },
        amount: {
            type: Number,
            default: 0,
        },
        name: String,
        image: String,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'cancelled'],
            default: 'pending',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'payment',
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);
const Order = model<TOrder, any>('order', schema);
export default Order;
