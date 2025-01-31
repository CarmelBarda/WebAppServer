import mongoose from 'mongoose';
import { ILike } from '../interfaces/ILike';

export const likeSchema = new mongoose.Schema<ILike>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);
