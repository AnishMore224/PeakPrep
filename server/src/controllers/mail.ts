import nodemailer, { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";
import Verification from "../models/Verification";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Student from "../models/Student";

dotenv.config();

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Function to send email
const sendMail = async (
  mailOptions: MailOptions
): Promise<SentMessageInfo | Error> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
};

// Function to generate and store verification code
const generateAndStoreCode = async (email: string): Promise<string | null> => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const expiresIn = Date.now() + 1000 * 60 * 5; // Expires in 5 minutes

  try {
    await Verification.findOneAndUpdate(
      { email },
      { verificationCode, expiresIn },
      { upsert: true, new: true }
    );
    return verificationCode;
  } catch (error) {
    console.error("Error saving verification code:", error);
    return null;
  }
};

// Send Verification Email
export const sendVerificationMail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  const verificationCode = await generateAndStoreCode(email);
  if (!verificationCode) {
    res.status(500).json({ message: "Failed to generate verification code" });
  }

  const mailOptions = {
    from: process.env.USER_EMAIL as string,
    to: email,
    subject: "Verify your email - PeakPrep",
    html: `<p>Your verification code is <strong>${verificationCode}</strong>. It will expire in 5 minutes.</p>`,
  };

  const result = await sendMail(mailOptions);
  if ((result as SentMessageInfo).messageId) {
    res.status(200).json({ message: "Verification email sent" });
  } else {
    res.status(500).json({ message: "Failed to send verification email" });
  }
};

// Verify Code and Update Email Verification Status
export const verifyCode = async (req: Request, res: Response): Promise<any> => {
  const { email, verificationCode } = req.body;

  try {
    const verification = await Verification.findOne({
      email,
      verificationCode,
    });
    if (!verification) {
      res.status(400).json({ message: "Invalid verification code" });
    }

    if (
      verification &&
      Date.now() > new Date(verification.expiresIn).getTime()
    ) {
      await Verification.deleteOne({ email, verificationCode });
      return res.status(400).json({ message: "Verification code expired" });
    }

    await Verification.deleteOne({ email, verificationCode });

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    if (decoded.role === "student") {
      const student = await Student.findOne({ email });
      if (!student)
        return res.status(404).json({ message: "Student not found" });

      await User.findOneAndUpdate({ _id: student.userId }, { verified: true });
    } else {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      await User.findOneAndUpdate({ _id: user._id }, { verified: true });
    }

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send Password Reset Email
export const PasswordResetMail = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;

  const verificationCode = await generateAndStoreCode(email);
  if (!verificationCode) {
    return res
      .status(500)
      .json({ message: "Failed to generate verification code" });
  }

  const mailOptions = {
    from: process.env.USER_EMAIL as string,
    to: "anishmore322@gmail.com",
    subject: "Reset Your Password - PeakPrep",
    html: `<p>Your password reset code is <strong>${verificationCode}</strong>. It will expire in 5 minutes.</p>`,
  };

  const result = await sendMail(mailOptions);
  if ((result as SentMessageInfo).messageId) {
    res.status(200).json({ message: "Password reset email sent" });
  } else {
    res.status(500).json({ message: "Failed to send password reset email" });
  }
};

// Verify Code and Update Password
export const verifyAndUpdatePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    const verification = await Verification.findOne({
      email,
      verificationCode,
    });
    if (!verification) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (Date.now() > new Date(verification.expiresIn).getTime()) {
      await Verification.deleteOne({ email, verificationCode });
      return res.status(400).json({ message: "Verification code expired" });
    }

    await Verification.deleteOne({ email, verificationCode });

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });;
    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (decoded.role === "student") {
      const student = await Student.findOne({ email });
      if (!student)
        return res.status(404).json({ message: "Student not found" });

      await User.findOneAndUpdate(
        { _id: student.userId },
        { password: hashedPassword }
      );
    } else {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      await User.findOneAndUpdate(
        { _id: user._id },
        { password: hashedPassword }
      );
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
