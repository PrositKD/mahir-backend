import { model, Schema } from 'mongoose';
import { TUserExist, TUser } from './user.interface';
import { USER_ROLE_ENUM } from '../../utils/constants';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const schema = new Schema<TUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            // unique: [true, 'Email address already exists'],
            trim: true,
        },
        phone: {
            type: String,
            unique: [true, 'Phone number already exists'],
            trim: true,
        },
        password: String,
        image: String,
        role: {
            type: String,
            enum: {
                values: USER_ROLE_ENUM,
                message: '{VALUE} is not a valid role',
            },
            default: 'user',
            required: true,
        },
        country: String,
        city: String,
        state: String,
        zip_code: String,
        address: String,
        permissions: {
            type: Schema.Types.ObjectId,
            ref: 'hrm_role',
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);
schema.pre<TUser>('save', async function (next): Promise<void> {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(
            this.password,
            Number(config.bcrypt_salt_rounds),
        );
    }
    next();
});
schema.post<TUser>('save', async function (doc: any, next: any): Promise<void> {
    doc.__v = undefined;
    next();
});
schema.statics.isPasswordMatched = async function (
    password: string,
    hashPassword: string,
): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
};
schema.statics.isUserExists = async function ({
    _id,
    email,
    phone,
}: TUserExist): Promise<any> {
    const user = await User.findOne({
        $or: [{ _id }, { email }, { phone }],
    });
    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Invalid input',
            'User not found !',
        );
    }
    return user;
};
schema.plugin(aggregatePaginate);
const User = model<TUser, any>('user', schema);
export default User;
