import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    owner: mongoose.Schema.Types.ObjectId;
    title: string;
    review: string;
    rate: number;
    likesCount: number;
    image?: string;
}
