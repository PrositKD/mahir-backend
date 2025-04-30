import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TService } from './service.interface';

const schema = new Schema<TService>(
    {
        title: {
            type: Schema.Types.Map,
            of: String,
            index: true,
            required: true,
        },
        short_description: {
            type: Schema.Types.Map,
            of: String,
        },
        description: {
            type: Schema.Types.Map,
            of: String,
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'service_tag',
            },
        ],
        category: {
            type: Schema.Types.ObjectId,
            ref: 'service_category',
        },
        video_url: String,
        status: Boolean,
        banner_image: String,
        card_image: String,
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Service = model<TService, any>('service', schema);
export default Service;
