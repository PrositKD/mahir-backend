import { Types } from 'mongoose';

export type TJob = {
    title: Map<string, string>;
    company_name: string;
    job_position: string;
    category: Types.ObjectId;
    vacancy: number;
    job_context: Map<string, string>;
    job_responsibility: Map<string, string>;
    educational_requirement: Map<string, string>;
    experience_requirement: Map<string, string>;
    additional_requirements: Map<string, string>;
    salary: number;
    deadline: Date;
    status: boolean;
    author_name: string;
    job_location: string;
    job_type: string;
};
