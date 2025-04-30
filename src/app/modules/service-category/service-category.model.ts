import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TServiceCategory } from './service-category.interface';
const schema = new Schema<TServiceCategory>(
    {
        name: {
            type: Schema.Types.Map,
            of: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
        image: String,
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const ServiceCategory = model<TServiceCategory, any>(
    'service_category',
    schema,
);

export default ServiceCategory;
