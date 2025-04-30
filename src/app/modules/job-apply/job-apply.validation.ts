import { z } from 'zod';
import { Types } from 'mongoose';

const postJobApplyValidationSchema = z.object({
    body: z.object({
        full_name: z
            .string({
                invalid_type_error: 'Full name must be string',
                required_error: 'Full name is required',
            })
            .min(1, {
                message: 'Full name is required',
            })
            .max(255, {
                message: 'Full name be less than or equal to 255 characters',
            })
            .trim(),
        email: z
            .string({
                invalid_type_error: 'Email must be string',
                required_error: 'Email is required',
            })
            .email({
                message: 'Email must be valid',
            }),
        phone: z
            .string({
                invalid_type_error: 'Phone number must be string',
                required_error: 'Phone number is required',
            })
            .optional(),
        address: z
            .string({
                invalid_type_error: 'Address must be string',
                required_error: 'Address is required',
            })
            .optional(),
        linkedin_url: z
            .string({
                invalid_type_error: 'Linkedin URL must be string',
                required_error: 'Linkedin URL is required',
            })
            .optional(),
        github_url: z
            .string({
                invalid_type_error: 'Github URL must be string',
                required_error: 'Github URL is required',
            })
            .optional(),
        experience: z
            .string({
                invalid_type_error: 'Experience  must be string',
                required_error: 'Experience URL is required',
            })
            .optional(),
        company: z
            .string({
                invalid_type_error: 'Company name must be string',
                required_error: 'Company name is required',
            })
            .optional(),
        education: z
            .string({
                invalid_type_error: 'Education must be string',
                required_error: 'Education  is required',
            })
            .optional(),
        university: z
            .string({
                invalid_type_error: 'University name must be string',
                required_error: 'university name required',
            })
            .optional(),
        resume: z.string({
            invalid_type_error: 'Resume must be string',
            required_error: 'Resume name required',
        }),
        cover_latter: z.string({
            invalid_type_error: 'Cover latter must be string',
            required_error: 'Cover latter name required',
        }),
        job: z
            .string({
                invalid_type_error: 'Job id must be string',
                required_error: 'Job id name required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Job id must be valid',
            }),
    }),
});

export const JobApplyValidations = {
    postJobApplyValidationSchema,
};
