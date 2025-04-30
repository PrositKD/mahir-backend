import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TCaseCategory } from './case-category.interface';
const schema = new Schema<TCaseCategory>(
    {
        name: {
            type: Schema.Types.Map,
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

const CaseCategory = model<TCaseCategory, any>('case_category', schema);

export default CaseCategory;
