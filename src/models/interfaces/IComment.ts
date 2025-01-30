import mongoose, { Document } from 'mongoose';

export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    message: string;
    postId: string;
}
