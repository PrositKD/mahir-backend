import { TCase } from './case.interface';
import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TCase>(
    {
        title: {
            type: Schema.Types.Map,
            of: String,
            index: true,
            required: [true, 'Title is required'],
        },
        client: String,
        duration: String,
        budget: {
            type: Number,
            required: [true, 'Budget is required'],
        },
        description: {
            type: Schema.Types.Map,
            of: String,
        },
        result: {
            type: Schema.Types.Map,
            of: String,
        },
        banner_image: String,
        card_image: String,
        status: {
            type: Boolean,
            default: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'case_category',
        },
        challenge:{
            type: Schema.Types.Map,
            of:String,
        },
        problem:{
            type: Schema.Types.Map,
            of:String,
        },
        solution:{
            type: Schema.Types.Map,
            of:String,
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'case_tag',
            },
        ],
    },
    {
        timestamps: true,
    },
);
schema.plugin(aggregatePaginate);
const Case = model<TCase, any>('case', schema);
export default Case;
