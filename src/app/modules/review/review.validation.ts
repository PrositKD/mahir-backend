import z from 'zod';
const postReviewValidationSchema = z.object({
    body: z.object({
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
