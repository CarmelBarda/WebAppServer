import mongoose from 'mongoose';
import { IComment } from '../interfaces/IComment';

export const commentSchema = new mongoose.Schema<IComment>({
  message: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  postId: { type: String, required: true },
});
