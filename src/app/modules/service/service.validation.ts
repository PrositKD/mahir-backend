import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postServiceValidationSchema = z.object({
    body: z.object({
        title: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Title must be string',
                    required_error: 'Title is required',
                })
                .min(1, {
                    message: 'Title is required',
                })
                .max(255, {
                    message:
                        'Title must be less than or equal to 255 characters',
                })
                .trim(),
            {
                message: 'Title must be object',
            },
        ),
        short_description: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Short description must be string',
                    required_error: 'Short description  is required',
                })
                .min(1, {
                    message: 'Short description  is required',
                })
                .max(500, {
                    message:
                        'Short description  must be less than or equal to 500 characters',
                })
                .trim(),
            {
                message: 'Short description  must be object',
            },
        ),
        description: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Description must be string',
                    required_error: 'Description is required',
                })
                .min(1, {
                    message: 'Description  is required',
                })
                .max(5000, {
                    message:
                        'Description  must be less than or equal to 5000 characters',
                }),
            {
                message: 'Description  must be object',
            },
        ),
        tags: z
            .array(
                z
                    .string({
                        invalid_type_error: 'Tags must be string',
                        required_error: 'Tags is required',
                    })
                    .refine((data) => Types.ObjectId.isValid(data), {
                        message: 'Tag Must be valid id',
                    }),
            )
            .optional(),
        category: z
            .string({
                invalid_type_error: 'Category must be string',
                required_error: 'Category is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'category is must be valid',
            }),
        video_url: z
            .string({
                invalid_type_error: 'Video URL must be string',
                required_error: 'Video URL is required',
            })
            .url({
                message: 'Video URL must be valid url',
            })
            .optional(),
        status: z
            .boolean({
                required_error: 'Status is required',
                invalid_type_error: 'Status must be string',
            })
            .default(true)
            .optional(),
        banner_image: z
            .string({
                required_error: 'Banner image is required',
                invalid_type_error: 'Banner image must be string',
            })
            .optional(),
        card_image: z.string({
            required_error: 'Card image is required',
            invalid_type_error: 'Card image must be string',
        }),
    }),
});
const updateServiceValidationSchema = z.object({
    body: z.object({
        title: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Title must be string',
                        required_error: 'Title is required',
                    })
                    .min(1, {
                        message: 'Title is required',
                    })
                    .max(255, {
                        message:
                            'Title must be less than or equal to 255 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Title must be object',
                },
            )
            .optional(),
        short_description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Short description must be string',
                        required_error: 'Short description  is required',
                    })
                    .min(1, {
                        message: 'Short description  is required',
                    })
                    .max(500, {
                        message:
                            'Short description  must be less than or equal to 500 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Short description  must be object',
                },
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Description must be string',
                        required_error: 'Description is required',
                    })
                    .min(1, {
                        message: 'Description  is required',
                    })
                    .max(5000, {
                        message:
                            'Description  must be less than or equal to 5000 characters',
                    }),
                {
                    invalid_type_error: 'Description  must be object',
                },
            )
            .optional(),
        tags: z
            .array(
                z
                    .string({
                        invalid_type_error: 'Tags must be string',
                        required_error: 'Tags is required',
                    })
                    .refine((data) => Types.ObjectId.isValid(data), {
                        message: 'Tag Must be valid id',
                    }),
            )
            .optional(),
        category: z
            .string({
                invalid_type_error: 'Category must be string',
                required_error: 'Category is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'category is must be valid',
            })
            .optional(),
        video_url: z
            .string({
                invalid_type_error: 'Video URL must be string',
                required_error: 'Video URL is required',
            })
            .url({
                message: 'Video URL must be valid url',
            })
            .optional(),
        status: z
            .boolean({
                required_error: 'Status is required',
                invalid_type_error: 'Status must be string',
            })
            .default(true)
            .optional(),
        banner_image: z
            .string({
                required_error: 'Banner image is required',
                invalid_type_error: 'Banner image must be string',
            })
            .optional(),
        card_image: z
            .string({
                required_error: 'Card image is required',
                invalid_type_error: 'Card image must be string',
            })
            .optional(),
    }),
});
export const ServiceValidations = {
    postServiceValidationSchema,
    updateServiceValidationSchema,
};
