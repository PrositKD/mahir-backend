import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TTag } from './case-tag.interface';

const schema = new Schema<TTag>(
    {
        name: {
            type: Schema.Types.Map,
            unique: [true, 'Tag name is already exists'],
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
const CaseTag = model<TTag, any>('case_tag', schema);
export default CaseTag;
