import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postBlogValidationSchema = z.object({
    body: z.object({
        title: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Blog category name must be string',
                    required_error: 'Blog category name is required',
                })
                .min(1, {
                    message: 'Blog category name is required',
                })
                .max(50, {
                    message:
                        'Blog category name must be less than or equal to 50 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Blog title must be object',
            },
        ),
        short_description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error:
                            'Blog  short_description must be string',
                        required_error: 'Blog short_description is required',
                    })
                    .optional(),
                {
                    invalid_type_error:
                        'Blog  short_description must be object',
                },
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error:
                            'Blog category description must be string',
                        required_error: 'Blog category description is required',
                    })
                    .optional(),
                {
                    invalid_type_error:
                        'Blog category description must be object',
                },
            )
            .optional(),
        banner_image: z.string({
            invalid_type_error: 'banner_image must be string',
            required_error: 'Banner image is required',
        }),
        card_image: z.string({
            invalid_type_error: 'Blog card_image must be string',
            required_error: 'Blog card_image image is required',
        }),
        category: z
            .string({
                invalid_type_error: 'Category _id must be string',
                required_error: 'Category _id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Category _id is invalid',
            }),
        tags: z
            .array(
                z
                    .string({
                        invalid_type_error: 'Tag _id must be string',
                        required_error: 'Tag _id is required',
                    })
                    .refine((data) => Types.ObjectId.isValid(data), {
                        message: 'Tag _id is invalid',
                    }),
            )
            .optional(),
        is_active: z
            .boolean({
                invalid_type_error: 'is_active must be boolean',
            })
            .default(true),
        is_latest: z
            .boolean({
                invalid_type_error: 'is_latest must be boolean',
            })
            .default(false),
    }),
});
const updateBlogValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: 'Blog category id must be string',
                required_error: 'Blog category id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Blog category is invalid',
            }),
        name: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Blog category name must be string',
                        required_error: 'Blog category name is required',
                    })
                    .min(1, {
                        message: 'Blog category name is required',
                    })
                    .max(50, {
                        message:
                            'Blog category name must be less than or equal to 50 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Blog category name must be object',
                },
            )
            .optional(),
        description: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error:
                            'Blog category description must be string',
                        required_error: 'Blog category description is required',
                    })
                    .optional(),
                {
                    invalid_type_error:
                        'Blog category description must be object',
                },
            )
            .optional(),
        banner_image: z
            .string({
                invalid_type_error: 'banner_image must be string',
                required_error: 'Banner image is required',
            })
            .optional(),
        card_image: z
            .string({
                invalid_type_error: 'Blog card_image must be string',
                required_error: 'Blog card_image image is required',
            })
            .optional(),
        tags: z
            .array(
                z
                    .string({
                        invalid_type_error: 'Tag _id must be string',
                        required_error: 'Tag _id is required',
                    })
                    .refine((data) => Types.ObjectId.isValid(data), {
                        message: 'Tag _id is invalid',
                    }),
            )
            .optional(),
        is_active: z
            .boolean({
                invalid_type_error: 'is_active must be boolean',
            })
            .default(true),
        is_latest: z
            .boolean({
                invalid_type_error: 'is_latest must be boolean',
            })
            .default(false),
    }),
});
export const BlogValidations = {
    postBlogValidationSchema,
    updateBlogValidationSchema,
};
