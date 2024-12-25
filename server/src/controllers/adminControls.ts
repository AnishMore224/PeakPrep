import { NextFunction, Request, Response } from "express";
import ApiResponse, { response } from "../types/response";
import HR from '../models/HR';
import Student from '../models/Student';
import Admin from '../models/Admin';
import Company from '../models/Company';
import User from '../models/User';
import { v4 as uuidv4 } from "uuid";
import mongoose, { mongo } from "mongoose";

export const addHr = async (req: Request, res: Response): Promise<any> => {
    // username <-> email, password, role: hr, name, company, 
    const { email, password, name, company } = req.body;
    if (!email || !password || !name || !company) {
        return res.status(400).send({ ...response, error: 'Missing required fields.' });
    }
    try {
        const existingHr = await HR.findOne({ email });
        const existingUser = await User.findOne({ username: email });

        if (existingUser || existingHr) {
            return res.status(400).send({ ...response, error: 'Email already exists for another user.' });
        }
        const companyRecord = await Company.findOne({ name: company });
        if (!companyRecord) {
            return res.status(404).send({ ...response, error: 'Company not found.' });
        }
        const userId = uuidv4();
        const newUser = new User({ _id: userId, username: email, password, role: 'hr' });
        const newHr = new HR({ userId, email, name, companyId: companyRecord._id });

        await newUser.save();
        await newHr.save();
        companyRecord.hr.push(newHr._id as mongoose.Types.ObjectId);
        await companyRecord.save();

        const { userId: hrUserId, ...hrDetails } = newHr.toObject();
        res.send({ ...response, message: 'HR added successfully.', data: { hr: hrDetails } });
    } catch (error) {
        res.status(500).send({ ...response, error });
    }
}

export const deleteHr = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;
    
    try {
      const hr = await HR.findOne({ email });
        if (!hr) {
            return res.status(404).send({ ...response, error: 'HR not found.' });
        }
        const company = await Company.findById(hr.companyId);
        if (company) {
            company.hr = company.hr.filter((hrId: mongoose.Types.ObjectId) => !hrId.equals(hr._id as mongoose.Types.ObjectId));
            await company.save();
        }
        await User.findOneAndDelete({ username: email });
        await HR.findOneAndDelete({ email });
        res.send({ ...response, success: true, message: 'HR deleted successfully.', hr });
    } catch (error) {
        res.status(500).send({ ...response, error: 'Internal server error.' });
    }
}

