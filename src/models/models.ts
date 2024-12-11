import { model, Model } from "mongoose";
import { IPost } from "./interfaces/IPost";
import { postSchema } from "./schemas/post.schema";
import { IUser } from "./interfaces/IUser";
import { userSchema } from "./schemas/user.schema";

export const Post: Model<IPost> = model<IPost>('posts', postSchema);
export const User: Model<IUser> = model<IUser>('users', userSchema);
