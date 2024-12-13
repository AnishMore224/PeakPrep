import mongoose, { Schema, Document } from 'mongoose';
import { ICompany } from '../types/collections';

const CompanySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    hr: [{ type: Schema.Types.ObjectId, ref: 'HR' }],
    shortlistedStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    selectedStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<ICompany>('Company', CompanySchema);