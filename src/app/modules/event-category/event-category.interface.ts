import { Document } from 'mongoose';
export interface TEventCategory extends Document {
    name: Map<string, string>;
    status: boolean;
    is_deleted: boolean;
}
