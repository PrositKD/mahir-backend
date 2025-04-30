import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Product from './product.model';

export class ProductService {
    static async postProductByPayload(payload: any) {
        const data = await Product.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new product!',
            );
        }
        return data;
    }
    static async findProductById(_id: string | Types.ObjectId) {
        const data = await Product.findById(_id)
            .populate({ path: 'category', select: 'name' })
            .select('-updatedAt -__v')
            .lean();
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product not found. please check product id and try again',
            );
        }
        return data;
    }
    static async findProductByQuery(
        filter: Record<string, string | boolean | Types.ObjectId>,
        query?: Record<string, string>,
        permission: boolean = true,
    ) {
        const data = await Product.findOne(filter).select('-updateAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product not found. please check  and try again',
            );
        }
        return data;
    }
    static async findProductListByQuery(
        filter: Record<string, string | Types.ObjectId>,
        query: Record<string, string | number>,
        select: Record<string, string | number>,
        permission: boolean = true,
    ) {
        const aggregate = Product.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'project_categories',
                    localField: 'category',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Product.aggregatePaginate(aggregate, options);
    }
    static async updateProductByQuery(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Product.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product not found. please check product id and try again',
            );
        }
        return data;
    }
    static async deleteProductById(_id: string | Types.ObjectId) {
        const data = await Product.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Product not found. Please verify the product ID and try again.!',
            );
        }
        return data;
    }
}
