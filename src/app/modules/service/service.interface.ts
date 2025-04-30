import { Types } from 'mongoose';

export type TService = {
    title: Map<string, string>;
    short_description: Map<string, string>;
    description: Map<string, string>;
    tags: string[];
    category: Types.ObjectId;
    video_url: string;
    status: boolean;
    banner_image: string;
    card_image: string;
};
