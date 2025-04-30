import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postServiceCategoryValidationSchema = z.object({
    body: z.object({
        name: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Name must be string',
                    required_error: 'Name is required',
                })
                .min(1, {
                    message: 'Name is required',
                })
                .max(255, {
                    message:
                        'Name must be less than or equal to 255 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Name must be object',
            },
        ),
        status: z
            .boolean({
                required_error: 'Status is required',
                invalid_type_error: 'Status must be string',
            })
            .default(true)
            .optional(),
        image: z.string({
            required_error: 'Image is required',
            invalid_type_error: 'Image must be string',
        }),
    }),
});
const updateServiceCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Name must be string',
                        required_error: 'Name is required',
                    })
                    .min(1, {
                        message: 'Name is required',
                    })
                    .max(255, {
                        message:
                            'Name must be less than or equal to 255 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Name must be object',
                },
            )
            .optional(),
        status: z
            .boolean({
                required_error: 'Status is required',
                invalid_type_error: 'Status must be string',
            })
            .optional(),
        image: z
            .string({
                required_error: 'Image is required',
                invalid_type_error: 'Image must be string',
            })
            .optional(),
    }),
});
export const ServiceCategoryValidations = {
    postServiceCategoryValidationSchema,
    updateServiceCategoryValidationSchema,
};
