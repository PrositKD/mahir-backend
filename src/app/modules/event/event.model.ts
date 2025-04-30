import { model, Schema } from 'mongoose';
import { TEvent } from './event.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TEvent>(
    {
        title: {
            type: Schema.Types.Map,
            of: String,
            unique: [true, 'Title already exists'],
            index: true,
        },
        description: {
            type: Schema.Types.Map,
            of: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        start_date: {
            type: Date,
        },
        end_date: {
            type: Date,
        },
        location: String,
        payment_type: {
            type: String,
            enum: ['paid', 'free'],
        },
        fee: {
            amount: Number,
            discount_type: {
                type: String,
                enum: ['fixed', 'percentage'],
            },
            discount_amount: Number,
        },
        image: String,
        organizer_name: String,
        organizer_image: String,
        organizer_email: String,
        organizer_phone: String,
        status: {
            type: Boolean,
            default: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'event_category',
            required: true,
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Event = model<TEvent, any>('event', schema);
export default Event;
