import mongoose from 'mongoose';
import { ILike } from '../interfaces/ILike';

export const likeSchema = new mongoose.Schema<ILike>({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
    required: true,
  },
});

likeSchema.index({ postId: 1, userId: 1 }, { unique: true });
