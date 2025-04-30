import { Types } from 'mongoose';

export type TCase = {
    title: Map<string, string>;
    client: string;
    card_image: string;
    banner_image: string;
    status: boolean;
    duration: string;
    budget: number;
    description: Map<string, string>;
    result: Map<string, string>;
    challenge:Map<string, string>;
    problem:Map<string, string>;
    solution:Map<string, string>;
    tags: Types.ObjectId[];
    category: Types.ObjectId;
};
