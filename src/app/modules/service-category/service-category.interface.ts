import { Document } from 'mongoose';
export interface TServiceCategory extends Document {
    name: Map<string, string>;
    status: boolean;
    image: string;
    is_deleted: boolean;
}
