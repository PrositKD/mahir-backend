import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postJobCategoryValidationSchema = z.object({
    body: z.object({
        name: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'name must be string',
                    required_error: 'name is required',
                })
                .min(1, {
                    message: 'name is required',
                })
                .max(255, {
                    message: 'name be less than or equal to 255 characters',
                })
                .trim(),
            {
                message: 'name must be object',
            },
        ),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Description must be string',
                        required_error: 'Description is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'Description must be object',
                },
            )
            .optional(),
    }),
});
const updateJobCategoryValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
        name: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Job category name must be string',
                        required_error: 'Job category name is required',
                    })
                    .min(1, {
                        message: 'Job category name is required',
                    })
                    .max(50, {
                        message:
                            'Job category name must be less than or equal to 50 characters',
                    })
                    .trim(),
                {
                    message: 'Job category name must be object',
                },
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error:
                            'Job category description must be string',
                        required_error: 'Job category description is required',
                    })
                    .optional(),
                {
                    message: 'Job category description must be object',
                },
            )
            .optional(),
    }),
});
export const JobCategoryValidations = {
    postJobCategoryValidationSchema,
    updateJobCategoryValidationSchema,
};
