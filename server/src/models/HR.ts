import mongoose, { Schema } from 'mongoose';
import { IHR } from '../types/collections';

const HrSchema: Schema = new Schema({
    userId: { type: String, ref: 'User', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    assets : [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IHR>('HR', HrSchema);