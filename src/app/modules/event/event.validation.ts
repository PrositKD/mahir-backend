import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postEventValidationSchema = z.object({
    body: z.object({
        title: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Event title must be string',
                    required_error: 'Event title  is required',
                })
                .min(1, {
                    message: 'Event title is required',
                })
                .max(500, {
                    message:
                        'Event title must be less than or equal to 500 characters',
                })
                .trim(),
            {
                invalid_type_error: 'Event title must be object',
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
        date: z
            .string({
                invalid_type_error: 'date must be string',
                required_error: 'Date is required',
            })
            .datetime({ offset: true }),
        start_date: z
            .string({
                invalid_type_error: 'start date must be string',
                required_error: 'start date is required',
            })
            .date(),
        end_date: z
            .string({
                invalid_type_error: 'end date must be string',
                required_error: 'end date is required',
            })
            .date(),
        location: z.string({
            invalid_type_error: 'location must be string',
            required_error: 'location is required',
        }),
        payment_type: z.enum(['paid', 'free'], {
            message: 'payment type must be paid or free',
        }),
        fee: z
            .object(
                {
                    amount: z.number({
                        invalid_type_error: 'Amount must be number',
                        required_error: 'amount must be string',
                    }),
                    discount_type: z.enum(['flat', 'percentage'], {
                        message: 'Discount type must be paid or free',
                    }),
                    discount_amount: z.number({
                        invalid_type_error: 'Discount amount must be number',
                        required_error: 'Discount is required',
                    }),
                },
                {
                    invalid_type_error: 'fee is a object',
                },
            )
            .optional(),
        image: z.string({
            invalid_type_error: 'Image must be string',
            required_error: 'Image image is required',
        }),

        organizer_name: z.string({
            invalid_type_error: 'Organizer name must be string',
            required_error: 'Organizer name is required',
        }),
        organizer_image: z.string({
            invalid_type_error: 'Organizer image must be string',
            required_error: 'Organizer image is required',
        }),
        organizer_email: z
            .string({
                invalid_type_error: 'Organizer email must be string',
                required_error: 'Organizer email is required',
            })
            .email({
                message: 'organizer Email must be valid',
            }),
        organizer_phone: z.string({
            invalid_type_error: 'Organizer phone must be string',
            required_error: 'Organizer phone is required',
        }),
        status: z
            .boolean({
                invalid_type_error: 'Status must be boolean',
                required_error: 'Status is required',
            })
            .default(true)
            .optional(),
        category: z
            .string({
                invalid_type_error: 'Category _id must be string',
                required_error: 'Category _id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Category _id is invalid',
            }),
    }),
});
const updateEventValidationSchema = z.object({
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
                        invalid_type_error: 'Event title must be string',
                        required_error: 'Event title  is required',
                    })
                    .min(1, {
                        message: 'Event title is required',
                    })
                    .max(500, {
                        message:
                            'Event title must be less than or equal to 500 characters',
                    })
                    .trim(),
                {
                    invalid_type_error: 'Event title must be object',
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
                    .optional(),
                {
                    invalid_type_error: 'Description must be object',
                },
            )
            .optional(),
        date: z
            .string({
                invalid_type_error: 'date must be string',
                required_error: 'Date is required',
            })
            .datetime({ offset: true })
            .optional(),
        start_date: z
            .string({
                invalid_type_error: 'start date must be string',
                required_error: 'start date is required',
            })
            .date()
            .optional(),
        end_date: z
            .string({
                invalid_type_error: 'end date must be string',
                required_error: 'end date is required',
            })
            .date()
            .optional(),
        location: z
            .string({
                invalid_type_error: 'location must be string',
                required_error: 'location is required',
            })
            .optional(),
        payment_type: z
            .enum(['paid', 'free'], {
                message: 'payment type must be paid or free',
            })
            .optional(),
        fee: z
            .object(
                {
                    amount: z
                        .number({
                            invalid_type_error: 'Amount must be number',
                            required_error: 'amount must be string',
                        })
                        .optional(),
                    discount_type: z
                        .enum(['flat', 'percentage'], {
                            message: 'Discount type must be flat or percentage',
                        })
                        .optional(),
                    discount_amount: z
                        .number({
                            invalid_type_error:
                                'Discount amount must be number',
                            required_error: 'Discount is required',
                        })
                        .optional(),
                },
                {
                    invalid_type_error: 'fee is a object',
                },
            )
            .optional(),
        image: z
            .string({
                invalid_type_error: 'Image must be string',
                required_error: 'Image image is required',
            })
            .optional(),

        organizer_name: z
            .string({
                invalid_type_error: 'Organizer name must be string',
                required_error: 'Organizer name is required',
            })
            .optional(),
        organizer_image: z
            .string({
                invalid_type_error: 'Organizer image must be string',
                required_error: 'Organizer image is required',
            })
            .optional(),
        organizer_email: z
            .string({
                invalid_type_error: 'Organizer email must be string',
                required_error: 'Organizer email is required',
            })
            .email({
                message: 'organizer Email must be valid',
            })
            .optional(),
        organizer_phone: z
            .string({
                invalid_type_error: 'Organizer phone must be string',
                required_error: 'Organizer phone is required',
            })
            .optional(),
        status: z
            .boolean({
                invalid_type_error: 'Status must be boolean',
                required_error: 'Status is required',
            })
            .optional(),
        category: z
            .string({
                invalid_type_error: 'Category _id must be string',
                required_error: 'Category _id is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Category _id is invalid',
            })
            .optional(),
    }),
});
const postEventBookingPaymentSchema = z.object({
    body: z.object({
        method: z.enum(['stripe', 'paypal', 'razorpay'], {
            message: 'Payment method should be stripe | paypal | razorpay',
        }),
        event: z
            .string({
                invalid_type_error: 'event id must be string',
                required_error: 'Event id must be required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Event id is invalid',
            }),
    }),
});
const updateEventBookingSchema = z.object({
    body: z.object({
        _id:z.string({
            invalid_type_error: 'ID must be a string',
            required_error: 'Id is required',
        }).refine((data) => Types.ObjectId.isValid(data), {
            message: 'Event id is invalid',
        }),
        status:  z.enum(['pending', 'accepted', 'cancelled'] ,{
            message:"Status must be accepted or cancelled or pending",
        })
    }),
});
export const EventValidations = {
    postEventValidationSchema,
    updateEventBookingSchema,
    updateEventValidationSchema,
    postEventBookingPaymentSchema,
};
