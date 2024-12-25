import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { IStudent, IUser } from "../types/collections";
import ApiResponse, { response } from "../types/response";
// import { switchDB } from "../utils/db";
import User from "../models/User";
import Student from "../models/Student";
import Admin from "../models/Admin";
import HR from "../models/HR";


export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, username, email, password, branch, section } = req.body; // check the sequence (should match with the frontend)

        // Check if all fields are provided
        if (!name || !username || !email || !password || !branch || !section) {
            return res
                .status(400)
                .json({ ...response, error: "All fields are required." });
        }

        // get database key
        const key = Number("20" + username.substring(0, 2)) + 4;
        // switchDB("SOA_ITER", key.toString());

        // Check if the user already exists
        const existingUser = await User.findOne({ username }); // 
        if (existingUser) {
            return res
                .status(400)
                .json({ ...response, error: "User already exists with this username." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = uuidv4();

        // Create and save the new user
        const user = new User({
            _id: userId,
            username,
            password: hashedPassword,
            role: "student"
        });
        await user.save();

        const student = new Student({
            _id: username, // registration no
            userId: user._id,
            admissionYear: key,
            name,
            email,
            section,
            branch,
            feedback: [],
            companies: [],
            placedAt: null,
        });
        await student.save();

        const token = jwt.sign({ user_id: user._id, regd_no: student._id, role: "student" }, process.env.JWT_SECRET || 'your_secret_key');
        // user_id: UUID, regd_no: regd_No, role: student

        res.status(201).json({
            ...response,
            success: true,
            message: "User registered successfully",
            data: {
                token,
                user: {
                    name,
                    regd_No: username,
                    branch,
                    section,
                    email
                }
            },
        });

    } catch (err: Error | any | null) {
        res.status(500).json({ ...response, error: err.message });
    }
};


export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;

        // Check if all fields are provided
        if (!username || !password) {
            return res
                .status(400)
                .json({ ...response, error: "Username and password are required." });
        }

        // get database key
        const key = Number("20" + username.substring(0, 2)) + 4;
        // switchDB("SOA_ITER", key.toString());

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ ...response, error: "Invalid username or password." });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ ...response, error: "Invalid password." });
        }

        if (user.role === "student") {
            const student = await Student.findOne({ _id: username })
            // Generate JWT token
            const token = jwt.sign({ id: user._id, regd_no: username, role: user.role }, process.env.JWT_SECRET || 'your_secret_key');

            res.status(200).json({
                ...response,
                success: true,
                message: "User logged in successfully",
                data: {
                    token,
                    user: {
                        name: student?.name,
                        regd_no: username,
                        branch: student?.branch,
                        section: student?.section,
                        email: student?.email,
                    }
                },
            });
        }
        else if (user.role === "admin") {
            // Generate JWT token
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_secret_key');

            const admin = await Admin.findOne({ userId: user._id });
            res.status(200).json({
                ...response,
                success: true,
                message: "User logged in successfully",
                data: {
                    token,
                    user: {
                        name: admin?.name,
                        username,
                        role: user.role
                    }
                },
            });
        }
        else if (user.role === "hr") {
            // Generate JWT token
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_secret_key');

            const hr = await HR.findOne({ userId: user._id });
            res.status(200).json({
                ...response,
                success: true,
                message: "User logged in successfully",
                data: {
                    token,
                    user: {
                        name: hr?.name,
                        email: hr?.email,
                        companyId: hr?.companyId,
                        username,
                        role: user.role
                    }
                },
            });

        }


    } catch (err: Error | any | null) {
        res.status(500).json({ ...response, error: err.message });
    }
};

export const logout = (req: Request, res: Response) => {
    res.status(200).json({
      ...response,
      success: true,
      data: { message: "Logged out successfully" },
    });
  };

  