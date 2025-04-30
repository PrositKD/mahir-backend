import z from 'zod';
import { Types } from 'mongoose';
const postReviewValidationSchema = z.object({
    body: z.object({
        product:z.string({
            invalid_type_error:"Product id is required.",
            required_error:"product id is required",
        }).refine((data)=> Types.ObjectId.isValid(data) , {
            message:"Product id must be valid.",
        }),
        rating: z
            .number({
                invalid_type_error: 'Rating must be number',
                required_error: 'Rating is required',
            })
            .gte(1, {
                message: 'Rating must be greater than 0',
            })
            .lte(5, {
                message: 'Rating must be less than or equal to 5',
            }),
        comment: z
            .string({
                invalid_type_error: 'comment must be string',
                required_error: 'comment is required',
            })
            .max(255, {
                message: 'comment length must be less  than 255 characters',
            })
            .optional(),
    }),
});
const updateReviewValidationSchema = z.object({
    body: z.object({
        _id:z.string({
            invalid_type_error:"Product id must be string",
            required_error:'product id is required'
        }).refine((data)=> Types.ObjectId.isValid(data) , {
            message:"Product id must be valid.",
        }),
        approve_status: z.boolean({
            invalid_type_error: 'Rating must be boolean',
            required_error: 'Rating is required',
        }),
    }),
});
export const ReviewValidations = {
    postReviewValidationSchema,
    updateReviewValidationSchema,
};
