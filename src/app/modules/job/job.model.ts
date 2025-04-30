import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TJob } from './job.interface';
const schema = new Schema<TJob>(
    {
        title: {
            type: Schema.Types.Map,
            index: true,
            of: String,
        },
        job_position: String,
        company_name: String,
        category: {
            type: Schema.Types.ObjectId,
            ref: 'job_category',
        },
        vacancy: Number,
        job_context: {
            type: Schema.Types.Map,
            of: String,
        },
        job_responsibility: {
            type: Schema.Types.Map,
            of: String,
        },
        educational_requirement: {
            type: Schema.Types.Map,
            of: String,
        },
        experience_requirement: {
            type: Schema.Types.Map,
            of: String,
        },
        additional_requirements: {
            type: Schema.Types.Map,
            of: String,
        },
        salary: Number,
        deadline: {
            type: Date,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        author_name: {
            type: String,
        },
        job_location: String,
        job_type: String,
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const Job = model<TJob, any>('job', schema);

export default Job;
