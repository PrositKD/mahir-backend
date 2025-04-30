import { model, Schema } from 'mongoose';
import { TEventCategory } from './event-category.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
const schema = new Schema<TEventCategory>(
    {
        name: {
            type: Schema.Types.Map,
            of: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const EventCategory = model<TEventCategory, any>('event_category', schema);

export default EventCategory;
