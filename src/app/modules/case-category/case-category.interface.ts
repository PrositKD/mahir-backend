import { Document } from 'mongoose';
export interface TCaseCategory extends Document {
    name: Map<string, string>;
    description: Map<string, string>;
    is_deleted: boolean;
}
