import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TJobCategory } from './job-category.interface';
const schema = new Schema<TJobCategory>(
    {
        name: {
            type: Schema.Types.Map,
            index: true,
            of: String,
        },
        description: {
            type: Schema.Types.Map,
            of: String,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const JobCategory = model<TJobCategory, any>('job_category', schema);

export default JobCategory;
