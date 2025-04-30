import { Types } from 'mongoose';
interface DynamicRecord {
    key: string;
    value: number;
}

export type TProvider = {
    name: string;
    title: Map<string, string>;
    expert: Types.ObjectId;
    about: Map<string, string>;
    professional_info: Map<string, string>;
    guidelines: Map<string, string>;
    image: string;
    phone: string;
    email: string;
    x_url: string;
    facebook_url: string;
    instagram_url: string;
    linkedin_url: string;
    is_deleted: boolean;
    dynamic_records: DynamicRecord[];
};
