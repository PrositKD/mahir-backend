import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postEventCategoryValidationSchema = z.object({
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
                invalid_type_error: 'Blog title must be object',
            },
        ),
        status: z
            .boolean({
                required_error: 'Event status is required',
                invalid_type_error: 'Event status is invalid',
            })
            .default(true)
            .optional(),
    }),
});
const updateEventCategoryValidationSchema = z.object({
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
                    invalid_type_error: 'Blog title must be object',
                },
            )
            .optional(),
        status: z
            .boolean({
                required_error: 'Blog status is required',
                invalid_type_error: 'Blog status is invalid',
            })
            .optional(),
    }),
});
export const EventCategoryValidations = {
    postEventCategoryValidationSchema,
    updateEventCategoryValidationSchema,
};
