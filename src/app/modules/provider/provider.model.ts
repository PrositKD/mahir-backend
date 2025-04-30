import { model, Schema, Types } from 'mongoose';
import { TProvider } from './provider.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TProvider>(
    {
        name: {
            type: String,
            index: true,
            required: true,
        },
        title: {
            type: Schema.Types.Map,
            of: String,
        },
        expert: {
            type: Schema.Types.ObjectId,
            ref: 'service_category',
        },
        about: {
            type: Schema.Types.Map,
            of: String,
        },
        professional_info: {
            type: Schema.Types.Map,
            of: String,
        },
        guidelines: {
            type: Schema.Types.Map,
            of: String,
        },
        image: String,
        phone: String,
        email: String,
        x_url: String,
        facebook_url: String,
        instagram_url: String,
        linkedin_url: String,
        is_deleted: {
            type: Boolean,
            default: false,
        },
        dynamic_records: [
            {
                key: String,
                value: Number,
            },
        ],
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Provider = model<TProvider, any>('provider', schema);
export default Provider;
