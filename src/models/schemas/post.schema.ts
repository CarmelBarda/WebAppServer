import mongoose from 'mongoose';
import { IPost } from '../interfaces/IPost';

export const postSchema = new mongoose.Schema<IPost>({
  title: { type: String, required: true },
  review: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  image: { type: String, required: false },
  rate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
