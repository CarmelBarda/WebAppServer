import mongoose, { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true }
});

const User = model<IUser>('users', userSchema);

export default User;