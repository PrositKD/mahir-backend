import { z } from 'zod';
import { Types } from 'mongoose';
import { languageEnum } from '../../utils/constants';

const postJobValidationSchema = z.object({
    body: z.object({
        title: z.record(
            languageEnum,
            z
                .string({
                    invalid_type_error: 'Title must be string.',
                    required_error: 'Title is required',
                })
                .max(255, {
                    message: 'Title should be less than 255 characters.',
                }),
        ),
        job_position: z.string({
            invalid_type_error: 'job_position must be string.',
            required_error: 'job_position is required',
        }),
        company_name: z.string({
            invalid_type_error: 'Company  must be string.',
            required_error: 'Company is required',
        }),
        category: z
            .string({
                invalid_type_error: 'Category  must be string.',
                required_error: 'Category is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Category is required',
            }),
        vacancy: z
            .number({
                invalid_type_error: 'Vacancy  must be number.',
                required_error: 'Vacancy is required',
            })
            .optional(),
        job_context: z.record(
            languageEnum,
            z.string({
                invalid_type_error: 'Job Context must be string.',
                required_error: 'Job Context is required',
            }),
        ),
        job_responsibility: z
            .record(
                languageEnum,
                z.string({
                    invalid_type_error: 'Job responsibility must be string.',
                    required_error: 'Job responsibility is required',
                }),
            )
            .optional(),
        educational_requirement: z.record(
            languageEnum,
            z.string({
                invalid_type_error: 'Educational requirement must be string.',
                required_error: 'Educational requirement is required',
            }),
        ),
        experience_requirement: z
            .record(
                languageEnum,
                z.string({
                    invalid_type_error:
                        'experience requirement must be string.',
                    required_error: 'experience requirement is required',
                }),
            )
            .optional(),
        additional_requirements: z
            .record(
                languageEnum,
                z.string({
                    invalid_type_error:
                        'Additional requirement must be string.',
                    required_error: 'Additional requirement is required',
                }),
            )
            .optional(),
        salary: z.number({
            invalid_type_error: 'Salary must be number.',
            required_error: 'Salary is required',
        }),
        deadline: z
            .string({
                invalid_type_error: 'Deadline must be string',
                required_error: 'Deadline is required',
            })
            .date(),
        author_name: z.string({
            invalid_type_error: 'Author name must be string.',
            required_error: 'Author name is required',
        }),
        job_location: z.string({
            invalid_type_error: 'job location must be string.',
            required_error: 'job location is required',
        }),
        job_type: z.string({
            invalid_type_error: 'Job type must be string.',
            required_error: 'Job type is required',
        }),
    }),
});
const updateJobValidationSchema = z.object({
    body: z.object({
        title: z
            .record(
                languageEnum,
                z
                    .string({
                        invalid_type_error: 'Title must be string.',
                        required_error: 'Title is required',
                    })
                    .max(255, {
                        message: 'Title should be less than 255 characters.',
                    }),
            )
            .optional(),
        job_position: z
            .string({
                invalid_type_error: 'job_position must be string.',
                required_error: 'job_position is required',
            })
            .optional(),
        company_name: z
            .string({
                invalid_type_error: 'Company  must be string.',
                required_error: 'Company is required',
            })
            .optional(),
        category: z
            .string({
                invalid_type_error: 'Category  must be string.',
                required_error: 'Category is required',
            })
            .refine((data) => Types.ObjectId.isValid(data), {
                message: 'Category is required',
            })
            .optional(),
        vacancy: z
            .number({
                invalid_type_error: 'Vacancy  must be number.',
                required_error: 'Vacancy is required',
            })
            .optional(),
        job_context: z
            .record(
                languageEnum,
                z.string({
                    invalid_type_error: 'Job Context must be string.',
                    required_error: 'Job Context is required',
                }),
            )
            .optional(),
        job_responsibility: z
            .record(
                languageEnum,
                z.string({
                    invalid_type_error: 'Job responsibility must be string.',
                    required_error: 'Job responsibility is required',
                }),
            )
            .optional(),
        educational_requirement: z
            .record(
                languageEnum,
                z.string({
                    invalid_type_error:
                        'Educational requirement must be string.',
                    required_error: 'Educational requirement is required',
                }),
            )
            .optional(),
        experience_requirement: z
            .record(
                languageEnum,
                z.string({
                    invalid_type_error:
                        'experience requirement must be string.',
                    required_error: 'experience requirement is required',
                }),
            )
            .optional(),
        additional_requirements: z
            .record(
                languageEnum,
                z.string({
                    invalid_type_error:
                        'Additional requirement must be string.',
                    required_error: 'Additional requirement is required',
                }),
            )
            .optional(),
        salary: z
            .number({
                invalid_type_error: 'Salary must be number.',
                required_error: 'Salary is required',
            })
            .optional(),
        deadline: z
            .string({
                invalid_type_error: 'Deadline must be string',
                required_error: 'Deadline is required',
            })
            .date()
            .optional(),
        author_name: z
            .string({
                invalid_type_error: 'Author name must be string.',
                required_error: 'Author name is required',
            })
            .optional(),
        job_location: z
            .string({
                invalid_type_error: 'job location must be string.',
                required_error: 'job location is required',
            })
            .optional(),
        job_type: z
            .string({
                invalid_type_error: 'Job type must be string.',
                required_error: 'Job type is required',
            })
            .optional(),
    }),
});
export const JobValidations = {
    postJobValidationSchema,
    updateJobValidationSchema,
};
