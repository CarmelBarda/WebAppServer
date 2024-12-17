import mongoose from "mongoose";
import { IComment } from "../interfaces/IComment";

export const commentSchema = new mongoose.Schema<IComment>({
    message: { type: String, required: true },
    userId: { type: String, required: true },
    postId: { type: String, required: true },
});
