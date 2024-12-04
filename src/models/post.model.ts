import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    owner: string;
}

const postSchema = new mongoose.Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    owner: { type: String, required: true },
});

const Post = model<IPost>('posts', postSchema);

export default Post;