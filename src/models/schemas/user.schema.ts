import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

export const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
});
