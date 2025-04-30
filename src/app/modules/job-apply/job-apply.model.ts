import { model, Schema } from 'mongoose';
import { TJobApply } from './job-apply.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TJobApply>(
    {
        full_name: {
            type: String,
            index: true,
        },
        email: {
            type: String,
        },
        phone: String,
        address: String,
        linkedin_url: String,
        github_url: String,
        experience: String,
        company: String,
        education: String,
        university: String,
        resume: String,
        cover_latter: String,
        job: {
            type: Schema.Types.ObjectId,
            required: [true, 'Job is required'],
            ref: 'job',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true, 'User is required'],
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const JobApply = model<TJobApply, any>('job_apply', schema);
export default JobApply;
