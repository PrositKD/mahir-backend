import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postCaseValidationSchema = z.object({
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
                invalid_type_error: 'Title must be object',
            },
        ),
        client: z
            .string({
                invalid_type_error: 'Client must be string',
                required_error: 'Client is required',
            })
            .max(50, {
                message:
                    'Client must be greater than or equal to 50 characters',
            }),
        duration: z.string({
            invalid_type_error: 'Duration must be number',
            required_error: 'Duration is required',
        }),
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
        result: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Result must be string',
                        required_error: 'Result is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'Result must be object',
                },
            )
            .optional(),
        banner_image: z.string({
            required_error: 'Banner is required',
            invalid_type_error: 'Banner must be string',
        }),
        card_image: z.string({
            required_error: 'Card_image is required',
            invalid_type_error: 'Card must be string',
        }),
        category: z
            .string({
                invalid_type_error: 'Category id must be string',
                required_error: 'Category id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Category _id is invalid',
            }),

        challenge: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'challenge must be string',
                        required_error: 'challenge is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'challenge must be object',
                },
            )
            .optional(),
        problem: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'problem must be string',
                        required_error: 'problem is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'problem must be object',
                },
            )
            .optional(),
        solution: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'solution must be string',
                        required_error: 'solution is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'solution must be object',
                },
            )
            .optional(),
        tags: z
            .array(
                z
                    .string({
                        invalid_type_error: 'Tag id must be string',
                        required_error: 'Tag id is required',
                    })
                    .refine((data) => Types.ObjectId.isValid(data), {
                        message: 'Category _id is invalid',
                    }),
            )
            .optional(),
    }),
});
const updateCaseValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({
                invalid_type_error: '_id must be string',
                required_error: '_id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: '_id is invalid',
            }),
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
        client: z
            .string({
                invalid_type_error: 'Client must be string',
                required_error: 'Client is required',
            })
            .max(50, {
                message:
                    'Client must be greater than or equal to 50 characters',
            })
            .optional(),
        duration: z
            .string({
                invalid_type_error: 'Duration must be number',
                required_error: 'Duration is required',
            })
            .optional(),
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
        result: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Result must be string',
                        required_error: 'Result is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'Result must be object',
                },
            )
            .optional(),
        banner_image: z
            .string({
                required_error: 'Banner is required',
                invalid_type_error: 'Banner must be string',
            })
            .optional(),
        card_image: z
            .string({
                required_error: 'Card_image is required',
                invalid_type_error: 'Card must be string',
            })
            .optional(),
        category: z
            .string({
                invalid_type_error: 'Category id must be string',
                required_error: 'Category id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Category _id is invalid',
            })
            .optional(),

        challenge: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'challenge must be string',
                        required_error: 'challenge is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'challenge must be object',
                },
            )
            .optional(),
        problem: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'problem must be string',
                        required_error: 'problem is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'problem must be object',
                },
            )
            .optional(),
        solution: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'solution must be string',
                        required_error: 'solution is required',
                    })
                    .optional(),
                {
                    invalid_type_error: 'solution must be object',
                },
            )
            .optional(),
        tags: z
            .array(
                z
                    .string({
                        invalid_type_error: 'Tag id must be string',
                        required_error: 'Tag id is required',
                    })
                    .refine((data) => Types.ObjectId.isValid(data), {
                        message: 'Category _id is invalid',
                    }),
            )
            .optional(),
        status: z
            .boolean({
                invalid_type_error: 'Status must be boolean',
                required_error: 'Status is required',
            })
            .optional(),
    }),
});
export const CaseValidations = {
    postCaseValidationSchema,
    updateCaseValidationSchema,
};
