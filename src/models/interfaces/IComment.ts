import mongoose, { Document } from 'mongoose';
import { IUser } from './IUser';

export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    message: string;
    userId: IUser;
    postId: string;
}
