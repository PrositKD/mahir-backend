import { model, Schema } from 'mongoose';
import { TSupport } from './support.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TSupport>(
    {
        title: {
            type: String,
            required: true,
            index: true,
        },
        subject: {
            type: String,
        },
        priority: {
            type: Number,
            required: true,
        },
        description: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Support = model<TSupport, any>('support_ticket', schema);
export default Support;
