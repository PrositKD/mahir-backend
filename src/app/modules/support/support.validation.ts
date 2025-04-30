import { z } from 'zod';

const postSupportValidationSchema = z.object({
    body: z.object({
        title: z
            .string({
                invalid_type_error: 'Title must be a string!',
                required_error: 'Title is required!',
            })
            .max(255, {
                message: 'Title must be less than 255 characters',
            }),
        subject: z
            .string({
                invalid_type_error: 'Subject must be a string!',
                required_error: 'Subject is required!',
            })
            .max(255, {
                message: 'Subject must be less than 255 characters',
            }),
        priority: z.number({
            invalid_type_error: 'Priority must be a number!',
            required_error: 'Priority is required!',
        }),
        description: z
            .string({
                invalid_type_error: 'Description must be a string!',
                required_error: 'Description is required!',
            })
            .max(255, {
                message: 'Description must be less than 255 characters',
            }),
    }),
});

export const SupportValidations = {
    postSupportValidationSchema,
};
