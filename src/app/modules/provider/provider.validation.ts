import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';
const postProviderValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
                invalid_type_error: 'Name must be string',
            })
            .min(1, {
                message: 'Name is required',
            })
            .max(50, {
                message: 'Name must be less than 50 characters',
            }),
        title: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'Title is required',
                    invalid_type_error: 'Title must be string',
                })
                .min(1, {
                    message: 'Name is required',
                })
                .max(255, {
                    message: 'Name must be less than 255 characters',
                }),
        ),
        expert: z
            .string({
                required_error: 'Expert is required',
                invalid_type_error: 'Expert is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Expert  must be valid id',
            }),
        about: z.record(
            languageEnum,
            z
                .string({
                    required_error: 'About is required',
                    invalid_type_error: 'About is required',
                })
                .max(500, {
                    message: 'About must be less than 500 characters',
                }),
        ),
        professional_info: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Professional info is required',
                        invalid_type_error: 'Professional  must be string',
                    })
                    .max(5000, {
                        message:
                            'Professional info must be less than 5000 characters',
                    }),
            )
            .optional(),
        guidelines: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Guidelines  is required',
                        invalid_type_error: 'Guidelines  must be string',
                    })
                    .max(5000, {
                        message:
                            'Guidelines info must be less than 5000 characters',
                    }),
            )
            .optional(),
        image: z.string({
            required_error: 'Image is required',
            invalid_type_error: 'Image must be string',
        }),
        phone: z
            .string({
                required_error: 'Phone is required',
                invalid_type_error: 'Phone must be string',
            })
            .optional(),
        email: z
            .string({
                required_error: 'Email is required',
                invalid_type_error: 'Email must be string',
            })
            .email({
                message: 'Email must be valid',
            })
            .optional(),
        x_url: z
            .string({
                required_error: 'X-Url is required',
                invalid_type_error: 'X-Url must be string',
            })
            .url({
                message: 'X-Url must be valid',
            })
            .optional(),
        facebook_url: z
            .string({
                required_error: 'Facebook url is required',
                invalid_type_error: 'Facebook url must be string',
            })
            .url({
                message: 'Facebook url must be valid',
            })
            .optional(),
        instagram_url: z
            .string({
                required_error: 'Instagram url is required',
                invalid_type_error: 'Instagram url must be string',
            })
            .url({
                message: 'Instagram url must be valid',
            })
            .optional(),
        linkedin_url: z
            .string({
                required_error: 'Linkedin url is required',
                invalid_type_error: 'Linkedin url must be string',
            })
            .url({
                message: 'Linkedin url must be valid',
            })
            .optional(),
        dynamic_records: z
            .array(
                z.object({
                    key: z
                        .string({
                            required_error: 'Key is required',
                            invalid_type_error: 'Key must be string',
                        })
                        .max(50, {
                            message: 'key must be less than 50 characters',
                        }),
                    value: z
                        .number({
                            required_error: 'Value is required',
                            invalid_type_error: 'Value must be Number',
                        })
                        .min(0, {
                            message: 'Value must be greater than 0 ',
                        })
                        .max(100, {
                            message: 'value must be less than 100',
                        }),
                }),
            )
            .optional(),
    }),
});

const updateProviderValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
                invalid_type_error: 'Name must be string',
            })
            .min(1, {
                message: 'Name is required',
            })
            .max(50, {
                message: 'Name must be less than 50 characters',
            })
            .optional(),
        title: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Title is required',
                        invalid_type_error: 'Title must be string',
                    })
                    .min(1, {
                        message: 'Name is required',
                    })
                    .max(255, {
                        message: 'Name must be less than 255 characters',
                    }),
            )
            .optional(),
        expert: z
            .string({
                required_error: 'Expert is required',
                invalid_type_error: 'Expert is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Expert  must be valid id',
            })
            .optional(),
        about: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'About is required',
                        invalid_type_error: 'About is required',
                    })
                    .max(500, {
                        message: 'About must be less than 500 characters',
                    }),
            )
            .optional(),
        professional_info: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Professional info is required',
                        invalid_type_error: 'Professional  must be string',
                    })
                    .max(5000, {
                        message:
                            'Professional info must be less than 5000 characters',
                    }),
            )
            .optional(),
        guidelines: z
            .record(
                languageEnum,
                z
                    .string({
                        required_error: 'Guidelines  is required',
                        invalid_type_error: 'Guidelines  must be string',
                    })
                    .max(5000, {
                        message:
                            'Guidelines info must be less than 5000 characters',
                    }),
            )
            .optional(),
        image: z
            .string({
                required_error: 'Image is required',
                invalid_type_error: 'Image must be string',
            })
            .optional(),
        phone: z
            .string({
                required_error: 'Phone is required',
                invalid_type_error: 'Phone must be string',
            })
            .optional(),
        email: z
            .string({
                required_error: 'Email is required',
                invalid_type_error: 'Email must be string',
            })
            .email({
                message: 'Email must be valid',
            })
            .optional(),
        x_url: z
            .string({
                required_error: 'X-Url is required',
                invalid_type_error: 'X-Url must be string',
            })
            .url({
                message: 'X-Url must be valid',
            })
            .optional(),
        facebook_url: z
            .string({
                required_error: 'Facebook url is required',
                invalid_type_error: 'Facebook url must be string',
            })
            .url({
                message: 'Facebook url must be valid',
            })
            .optional(),
        instagram_url: z
            .string({
                required_error: 'Instagram url is required',
                invalid_type_error: 'Instagram url must be string',
            })
            .url({
                message: 'Instagram url must be valid',
            })
            .optional(),
        linkedin_url: z
            .string({
                required_error: 'Linkedin url is required',
                invalid_type_error: 'Linkedin url must be string',
            })
            .url({
                message: 'Linkedin url must be valid',
            })
            .optional(),
        dynamic_records: z
            .array(
                z.object({
                    key: z
                        .string({
                            required_error: 'Key is required',
                            invalid_type_error: 'Key must be string',
                        })
                        .max(50, {
                            message: 'key must be less than 50 characters',
                        }),
                    value: z
                        .number({
                            required_error: 'Value is required',
                            invalid_type_error: 'Value must be Number',
                        })
                        .min(0, {
                            message: 'Value must be greater than 0 ',
                        })
                        .max(100, {
                            message: 'value must be less than 100',
                        }),
                }),
            )
            .optional(),
    }),
});

export const ProviderValidations = {
    postProviderValidationSchema,
    updateProviderValidationSchema,
};
