import mongoose, { Document } from 'mongoose';

export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    message: string;
    userId: string;
    postId: string;
}
