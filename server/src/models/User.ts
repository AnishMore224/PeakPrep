import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/collections';

const UserSchema: Schema = new Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "hr", "student"] },
    verified: { type: Boolean, required: true, default: false }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IUser>('User', UserSchema);