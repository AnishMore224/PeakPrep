import mongoose, { Document } from "mongoose";

interface IStudent extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    section: string;
    branch: string;
    admissionYear: number;
    feedback: mongoose.Types.ObjectId[];
    companies: mongoose.Types.ObjectId[];
    placedAt: mongoose.Types.ObjectId | null;
}

interface IHR extends Document {
    userId: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    name: string;
    email: string;
}

interface ICompany extends Document {
    name: string;
    hr: mongoose.Types.ObjectId[];
    shortlistedStudents: mongoose.Types.ObjectId[];
    selectedStudents: mongoose.Types.ObjectId[];
}

interface IFeedback extends Document {
    studentId: mongoose.Types.ObjectId;
    companyName: string;
    type: 'pi' | 'gd' | 'training';
    rating: number;
    comment: string;
}


interface IAdmin extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
}

export type { IStudent, IHR, ICompany, IFeedback, IAdmin };