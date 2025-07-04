import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../types/collections';

const AdminSchema: Schema = new Schema(
    {
        userId: { type: String, ref: 'User', required: true, index: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        assets : [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IAdmin>('Admin', AdminSchema);