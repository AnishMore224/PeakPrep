import mongoose, { Schema, Document } from 'mongoose';
import { IAdmin } from '../types/collections';

const AdminSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IAdmin>('Admin', AdminSchema);