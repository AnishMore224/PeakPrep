import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    role: 'admin' | 'hr' | 'student';
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "hr", "student"] }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IUser>('User', UserSchema);