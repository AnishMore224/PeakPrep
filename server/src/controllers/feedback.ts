import { Request, Response } from "express";
import { response } from "../types/response";
import Student from "../models/Student";
import Company from "../models/Company";
import Feedback from "../models/Feedback";
import mongoose from "mongoose";

export const addFeedback = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { studentId, companyName, type, rating, comment } = req.body;
  if (!studentId || !companyName || !type || !rating || !comment) {
    return res
      .status(400)
      .send({ ...response, error: "All fields are required." });
  }
  try {
    const student = await Student.findOne({ _id: studentId });
    if (!student) {
      return res.status(404).send({ ...response, error: "Student not found." });
    }

    const company = await Company.findOne({ name: companyName });
    if (!company) {
      return res.status(404).send({ ...response, error: "Company not found." });
    }

    const feedback = new Feedback({
      studentId,
      companyName,
      type,
      rating,
      comment,
    });

    await feedback.save();

    student.feedback.push(feedback._id as mongoose.Types.ObjectId);
    await student.save();

    res.send({
      ...response,
      success: true,
      message: "Feedback added successfully.",
    });
  } catch (error) {
    res.status(500).send({ ...response, error });
  }
};

export const deleteFeedback = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { feedbackId } = req.body;
  if (!feedbackId) {
    return res
      .status(400)
      .send({ ...response, error: "Feedback ID required." });
  }
  try {
    const feedback = await Feedback.findOne({ _id: feedbackId });
    if (!feedback) {
      return res
        .status(404)
        .send({ ...response, error: "Feedback not found." });
    }
    await feedback.deleteOne();
    const student = await Student.findOne({ _id: feedback.studentId });
    if (student) {
      student.feedback = student.feedback.filter(
        (f) => f.toString() !== feedbackId
      );
      await student.save();
    }

    res.send({
      ...response,
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    res.status(500).send({ ...response, error });
  }
};

export const updateFeedback = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { feedbackId, type, rating, comment } = req.body;
  if (!feedbackId || !type || !rating || !comment) {
    return res
      .status(400)
      .send({ ...response, error: "All fields are required." });
  }
  try {
    const feedback = await Feedback.findOne({ _id: feedbackId });
    if (!feedback) {
      return res
        .status(404)
        .send({ ...response, error: "Feedback not found." });
    }
    feedback.type = type;
    feedback.rating = rating;
    feedback.comment = comment;
    await feedback.save();
    res.send({
      ...response,
      success: true,
      message: "Feedback updated successfully.",
    });
  } catch (error) {
    res.status(500).send({ ...response, error });
  }
};

//Called by Student
export const feedbacks = async (req: Request, res: Response): Promise<any> => {
  try {
    const { regd_no } = req.body;

    if (!regd_no) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const student = await Student.findOne({ _id: regd_no }).populate({
      path: "feedback",
      select: "-studentId", // Exclude the studentId field from the populated feedback documents
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const feedbacksData = student.feedback;

    return res.status(200).json({
      success: true,
      data: feedbacksData,
      message: "Successfully fetched feedback",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...response, error: "Internal Server Error" });
  }
};

//Called by Admin, HR and Student
export const feedback = async (req: Request, res: Response): Promise<any> => {
  try {
    const { _id, company_name, regd_no, token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (token.role === "student" || token.role === "admin") {
      if (!regd_no || !company_name) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const feedback = await Feedback.findOne({
        studentId: regd_no,
        companyName: company_name,
      });
      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }
      const { studentId, ...feedbackData } = feedback.toObject();
      return res.status(200).json({
        success: true,
        data: feedbackData,
        message: "Successfully fetched feedback",
      });
    } else if (token.role === "hr") {
      if (!_id) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const feedback = await Feedback.findOne({ _id });
      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }
      return res.status(200).json({
        success: true,
        data: feedback,
        message: "Successfully fetched feedback",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
