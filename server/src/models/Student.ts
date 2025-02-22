import mongoose, { Schema } from 'mongoose';
import { IStudent, DailyContestType, CodingContestType } from '../types/collections';

type contestType = DailyContestType | CodingContestType;

const StudentSchema: Schema = new Schema({
  _id: { type: String, required: true }, // Registration number
  userId: { type: String, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  section: { type: String, required: true },
  branch: { type: String, required: true },
  admissionYear: { type: Number, required: true },
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', default: null },
  totalContestpoints: { type: Number, default: 0 },
  contests: [{
    points: { type: Number },
    contest_id: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'contests.type' 
    }],
    type: { type: String, enum: ['DailyContest', 'CodingContest'], required: true }
  }],
  feedback: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
  companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  placedAt: [{ type: Schema.Types.ObjectId, ref: 'Company', default: null }],
  completedCompanies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  assets : [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
}, {
  timestamps: true,
  versionKey: false
});

export default mongoose.model<IStudent>('Student', StudentSchema);