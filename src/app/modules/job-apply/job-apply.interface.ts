import { Types } from 'mongoose';

export type TJobApply = {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    linkedin_url: string;
    github_url: string;
    experience: string;
    company: string;
    education: string;
    university: string;
    resume: string;
    cover_latter: string;
    job: Types.ObjectId;
    user: Types.ObjectId;
};
