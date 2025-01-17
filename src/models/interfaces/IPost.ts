import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    owner: string;
    image?: string;
}
