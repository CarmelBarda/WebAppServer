import mongoose from "mongoose";
import { IPost } from "../interfaces/IPost";

export const postSchema = new mongoose.Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    owner: { type: String, required: true },
});
