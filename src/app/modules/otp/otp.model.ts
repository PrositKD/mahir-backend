import { TOtp } from './otp.interface';
import { model, models, Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const schema = new Schema<TOtp>(
    {
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            toLowerCase: true,
        },
        code: String,
        action: String,
        attempts: {
            type: Number,
            default: 3,
        },
        otp_option: String,
        expireAt: {
            type: Date,
            default: Date.now,
            index: { expires: '2m' },
        },
        created_time: Date,
        expired_time: Date,
    },
    {
        timestamps: true,
    },
);

schema.plugin(mongooseAggregatePaginate);
const OTP = model<TOtp>('otp', schema);
export default OTP;
