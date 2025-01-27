import mongoose, { Document } from "mongoose";


interface IUser extends Document {
    username: string;
    password: string;
    role: 'admin' | 'hr' | 'student';
}
interface IStudent extends Document {
    userId: string;
    name: string;
    email: string;
    section: string;
    branch: string;
    admissionYear: number;
    feedback: mongoose.Types.ObjectId[];
    companies: mongoose.Types.ObjectId[];
    placedAt: mongoose.Types.ObjectId[];
    completedCompanies: mongoose.Types.ObjectId[];
}

interface IHR extends Document {
    userId: string;
    companyId: mongoose.Types.ObjectId;
    name: string;
    email: string;
}

interface ICompany extends Document {
    name: string;
    hr: mongoose.Types.ObjectId[];
    shortlistedStudents: string[];
    selectedStudents: string[];
    completedStudents: string[];
    tags: string[];
}

interface IFeedback extends Document {
    studentId: string;
    companyName: string;
    type: 'pi' | 'gd' | 'training';
    rating: number;
    comment: string;
}

interface IAdmin extends Document {
    userId: string;
    name: string;
    email: string;
}

export type { IUser, IStudent, IHR, ICompany, IFeedback, IAdmin };