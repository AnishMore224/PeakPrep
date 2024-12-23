import { NextFunction, Request, Response } from "express";
import ApiResponse, { response } from "../types/response";
import User from "../models/User";
import Student from "../models/Student";
import HR from "../models/HR";
import Company from "../models/Company";


//Called by only admin
export const students = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ ...response, error: "All fields are required" });
    }

    if (token.role === "student" || token.role === "hr") {
      return res.status(400).json({ ...response, error: "Permission Denied" });
    }

    const students = await Student.find();

    if (!students || students.length === 0) {
      return res.status(404).json({ ...response, error: "No students found" });
    }
    const studentsData = students.map((student) => {
      const { userId, ...studentData } = student.toObject();
      return studentData;
    });

    return res.status(200).json({
      ...response,
      success: true,
      data: studentsData,
      message: "Successfully fetched students",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...response, error: "Internal Server Error" });
  }
};


//Called by HR and admin
export const student = async (req: Request, res: Response): Promise<any> => {
  try {
    const { regd_no, token } = req.body;
    if (!regd_no || !token) {
      return res
        .status(400)
        .json({ ...response, error: "All fields are required" });
    }

    if (token.role === "student") {
      return res.status(400).json({ ...response, error: "Permission Denied" });
    }

    const student = await Student.findOne({ _id: regd_no });

    if (!student) {
      return res.status(400).json({ ...response, error: "Student not found" });
    }

    if (token.role === "admin") {
      const { userId, ...studentData } = student.toObject();
      return res.status(200).json({
        ...response,
        success: true,
        data: studentData,
        message: "Student found",
      });
    } else if (token.role === "hr") {
      const { userId, feedback, companies, placedAt, ...studentData } =
        student.toObject();
      return res.status(200).json({
        ...response,
        success: true,
        data: studentData,
        message: "Student found",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...response, error: "Internal Server Error" });
  }
};


//Called only by Admin
export const companies = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ ...response, error: "All fields are required" });
    }

    if (token.role === "student" || token.role === "hr") {
      return res.status(400).json({ ...response, error: "Permission Denied" });
    }

    const companies = await Company.find(); // To populate or not
    if (!companies || companies.length === 0) {
      return res.status(404).json({ ...response, error: "No companies found" });
    }

    return res.status(200).json({
      ...response,
      success: true,
      data: companies,
      message: "Successfully fetched companies",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...response, error: "Internal Server Error" });
  }
};

export const company = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, token } = req.body;
    if (!name || !token) {
      return res
        .status(400)
        .json({ ...response, error: "All fields are required" });
    }

    const company = await Company.findOne({ name });
    if (!company) {
      return res.status(404).json({ ...response, error: "Company not found" });
    }

    const hr = await HR.findOne({ name: company.hr[0] });
    if (!hr) {
      return res.status(404).json({ ...response, error: "HR not found" });
    }

    if (token.role === "student") {
      const { shortlistedStudents, selectedStudents, ...companyData } =
        company.toObject();
      return res.status(200).json({
        ...response,
        success: true,
        data: {
          hrName: hr.name,
          ...companyData,
        },
        message: "Successfully fetched company",
      });
    } else if (token.role === "hr") {
      return res.status(200).json({
        ...response,
        success: true,
        data: company,
        message: "Successfully fetched company",
      });
    } else if (token.role === "admin") {
      return res.status(200).json({
        ...response,
        success: true,
        data: company,
        message: "Successfully fetched company",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...response, error: "Internal Server Error" });
  }
};

export const hrs = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ ...response, error: "All fields are required" });
    }

    if (token.role === "student" || token.role === "hr") {
      return res.status(400).json({ ...response, error: "Permission Denied" });
    }

    const hrs = await HR.find();
    if (!hrs || hrs.length === 0) {
      return res.status(404).json({ ...response, error: "No HRs found" });
    }

    const hrsData = hrs.map((hr) => {
      const { userId, ...hrData } = hr.toObject();
      return hrData;
    });

    return res.status(200).json({
      ...response,
      success: true,
      data: hrsData,
      message: "Successfully fetched HRs",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...response, error: "Internal Server Error" });
  }
};

export const hr = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, token } = req.body;
    if (!id || !token) {
      return res
        .status(400)
        .json({ ...response, error: "All fields are required" });
    }

    const hr = await HR.findOne({ _id: id });
    if (!hr) {
      return res.status(404).json({ ...response, error: "HR not found" });
    }

    if (token.role === "student") {
      const { userId, companyId, ...hrData } = hr.toObject();
      return res.status(200).json({
        ...response,
        success: true,
        data: hrData,
        message: "Successfully fetched HR",
      });
    } else if (token.role === "hr") {
      return res.status(200).json({
        ...response,
        success: true,
        data: hr,
        message: "Successfully fetched HR",
      });
    } else if (token.role === "admin") {
      return res.status(200).json({
        ...response,
        success: true,
        data: hr,
        message: "Successfully fetched HR",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ...response, error: "Internal Server Error" });
  }
};
