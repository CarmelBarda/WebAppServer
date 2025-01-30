import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    review: string;
    owner: string;
    rate: number;
    likesCount: number;
    image?: string;
}
