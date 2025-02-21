import { Request, Response } from "express";
import { response } from "../types/response";
import { IUser, IHR } from "../types/collections";
import HR from '../models/HR';
import Student from '../models/Student';
import Admin from '../models/Admin';
import Company from '../models/Company';
import User from '../models/User';
import { v4 as uuidv4 } from "uuid";
import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcryptjs';
import Feedback from "../models/Feedback";

export const addHr = async (req: Request, res: Response): Promise<any> => {
    // username <-> email, password, role: hr, name, company, 
    const { email, password, name, company } = req.body;
    if (!email || !password || !name || !company) {
        return res.status(400).json({ ...response, error: 'Missing required fields.' });
    }
    let newUser: IUser | null = null;
    let newHr: IHR | null = null;
    try {
        const existingHr = await HR.findOne({ email });
        const existingUser = await User.findOne({ username: email });

        if (existingUser || existingHr) {
            return res.status(400).json({ ...response, error: 'Email already exists for another user.' });
        }
        const companyRecord = await Company.findOne({ name: company });
        if (!companyRecord) {
            return res.status(404).json({ ...response, error: 'Company not found.' });
        }
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        newUser = new User({ _id: userId, username: email, password: hashedPassword, role: 'hr' });
        newHr = new HR({ userId, email, name, companyId: companyRecord._id });

        await newUser.save();
        await newHr.save();
        companyRecord.hr.push(newHr._id as mongoose.Types.ObjectId);
        await companyRecord.save();

        const { userId: hrUserId, ...hrDetails } = newHr.toObject();
        res.status(201).json({ ...response, success: true, message: 'HR added successfully.', data: { hr: hrDetails } });
    } catch (error) {
        if (newUser) {
            await newUser.deleteOne();
        }
        if (newHr) {
            await newHr.deleteOne();
        }
        res.status(500).json({ ...response, error });
    }
}

export const deleteHr = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;
     if (!email) {
        return res.status(400).json({ ...response, error: 'Email required' });
    }
    try {
      const hr = await HR.findOne({ email });
        if (!hr) {
            return res.status(404).json({ ...response, error: 'HR not found.' });
        }
        const company = await Company.findById(hr.companyId);
        if (company) {
            company.hr = company.hr.filter((hrId: mongoose.Types.ObjectId) => !hrId.equals(hr._id as mongoose.Types.ObjectId));
            await company.save();
        }
        await User.findOneAndDelete({ username: email });
        await HR.findOneAndDelete({ email });
        res.status(200).json({ ...response, success: true, message: 'HR deleted successfully.', data: hr });
    } catch (error) {
        res.status(500).json({ ...response, error: 'Internal server error.' });
    }
}

export const addStudent = async (req: Request, res: Response): Promise<any> => {
    const { username, password, name, branch, section, admissionYear } = req.body;
    if ( !password || !name || !branch || !section || !admissionYear) {
        return res.status(400).json({ ...response, error: 'Missing required fields.' });
    }
    let newUser: IUser | null = null;
    try {
        const existingStudent = await Student.findOne({ _id: username });
        const existingUser = await User.findOne({ username });

        if (existingUser || existingStudent) {
            return res.status(400).json({ ...response, error: 'Email already exists for another user.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        newUser = new User({ _id: userId, username, password: hashedPassword, role: 'student' });
        const newStudent = new Student({ _id: username, userId, name, branch, section, admissionYear });

        await newUser.save();
        await newStudent.save();

        const { userId: studentUserId, ...studentDetails } = newStudent.toObject();
        res.status(201).json({ ...response, success: true, message: 'Student added successfully.', data: { student: studentDetails } });
    } catch (error) {
        if (newUser) {
            await newUser.deleteOne();
        }
        res.status(500).json({ ...response, error });
    }
}

export const deleteStudent = async (req: Request, res: Response): Promise<any> => {
    const { username } = req.body;
    if(!username) {
        return res.status(400).json({ ...response, error: 'Username required' });
    }
    try {
        const student = await Student.findOne({ _id: username });
        if (!student) {
            return res.status(404).json({ ...response, error: 'Student not found.' });
        }
        const user = await User.findOne({ _id: student.userId });
        if (!user) {
            return res.status(404).json({ ...response, error: 'User not found.' });
        }
        // Remove: (in student collection)
        // feedback: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
        // companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
        // placedAt: { type: Schema.Types.ObjectId, ref: 'Company', default: null }

        // in other collections: 
        Feedback.deleteMany({ _id: { $in: student.feedback } });
        Company.updateMany(
            { $or: [{ _id: { $in: student.companies } }, { _id: student.placedAt }] },
            { $pull: { shortlistedStudents: student._id, selectedStudents: student._id } }
        );

        await User.findByIdAndDelete(user._id);
        await Student.findByIdAndDelete(student._id);
        res.status(200).json({ ...response, success: true, message: 'Student deleted successfully.', data: student });
    } catch (error) {
        res.status(500).json({ ...response, error });
    }
}

export const addAdmin = async (req: Request, res: Response): Promise<any> => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ ...response, error: 'Missing required fields.' });
    }
    let newUser: IUser | null = null;
    try {
        const existingAdmin = await Admin.findOne({ email });
        const existingUser = await User.findOne({ username: email });

        if (existingUser || existingAdmin) {
            return res.status(400).json({ ...response, error: 'Email already exists for another user.' });
        }
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        newUser = new User({ _id: userId, username: email, password: hashedPassword, role: 'admin' });
        const newAdmin = new Admin({ userId, email, name });

        await newUser.save();
        await newAdmin.save();

        const { userId: adminUserId, ...adminDetails } = newAdmin.toObject();
        res.status(201).json({ ...response, success: true, message: 'Admin added successfully.', data: { admin: adminDetails } });
    } catch (error) {
        if (newUser) {
            await newUser.deleteOne();
        }
        res.status(500).json({ ...response, error });
    }
}

export const deleteAdmin = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;
    if(!email) {
        return res.status(400).json({ ...response, error: 'Email required' });
    }
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ ...response, error: 'Admin not found.' });
        }
        const user = await User.findOne({ _id: admin.userId });
        if (!user) {
            return res.status(404).json({ ...response, error: 'User not found.' });
        }
        if(user.username === 'root') {
            return res.status(403).json({ ...response, error: 'Cannot delete root admin.' });
        }
        await User.findByIdAndDelete(user._id);
        await Admin.findByIdAndDelete(admin._id);
        res.status(200).json({ ...response, success: true, message: 'Admin deleted successfully.', data: admin });
    } catch (error) {
        res.status(500).json({ ...response, error });
    }
}

// review this function
export const addCompany = async (req: Request, res: Response): Promise<any> => {
    const { name, tags } = req.body;
    if (!name) {
        return res.status(400).json({ ...response, error: 'Missing required fields.' });
    }
    try {
        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({ ...response, error: 'Company already exists.' });
        }
        const newCompany = new Company({ name, tags: tags || [] });
        await newCompany.save();
        res.status(201).json({ ...response, success: true, message: 'Company added successfully.', data: { company: newCompany } });
    } catch (error) {
        res.status(500).json({ ...response, error });
    }
}

// review 
export const deleteCompany = async (req: Request, res: Response): Promise<any> => {
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({ ...response, error: 'Company name required' });
    }
    try {
        const company = await Company.findOne({ name });
        if (!company) {
            return res.status(404).json({ ...response, error: 'Company not found.' });
        }

        // Remove HRs associated with the company
        await HR.deleteMany({ companyId: company._id });

        // Remove students associated with the company
        await Student.updateMany(
            { $or: [{ _id: { $in: company.shortlistedStudents } }, { _id: { $in: company.selectedStudents } }, { _id: company.completedStudents }] },
            { $pull: { companies: company._id, placedAt: company._id, completedCompanies: company._id} }
        );

        // Remove the company
        await Company.findByIdAndDelete(company._id);
        res.status(200).json({ ...response, success: true, message: 'Company deleted successfully.', data: company });
    } catch (error) {
        res.status(500).json({ ...response, error });
    }
}
