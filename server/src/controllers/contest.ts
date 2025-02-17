import { Request, Response } from "express";
import DailyContest from "../models/contest/DailyContest";
import CodingContest from "../models/contest/CodingContest";
import jwt from "jsonwebtoken";

import { Model } from "mongoose";

const getModel = (type: string): Model<any> => {
  switch (type) {
    case "DailyContest":
      return DailyContest;
    case "CodingContest":
      return CodingContest;
    default:
      throw new Error("Invalid contest type");
  }
};

export const joinContest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", error: null });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const studentId = decoded.username;
    const { contestId, type } = req.body;

    if (!contestId || !studentId || !type) {
      return res.status(400).json({
        success: false,
        message: "Contest ID, Student ID, and type are required",
        error: null,
      });
    }

    const Contest = getModel(type);
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found", error: null });
    }

    if (
      contest.participants.some(
        (participant: { studentId: string }) =>
          participant?.studentId?.toString() === studentId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Student already joined the contest",
        error: null,
      });
    }

    contest.participants.push({ studentId });
    await contest.save();

    res.status(200).json({
      success: true,
      message: "Student joined the contest successfully",
      data: { contest },
      error: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getDailyContests = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const contests = await DailyContest.find();
    res.status(200).json({ success: true, data: { contests }, error: null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getCodingContests = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const contests = await CodingContest.find();
    res.status(200).json({ success: true, data: { contests }, error: null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getContest = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, type } = req.params;
    if (!id || !type) {
      return res.status(400).json({
        success: false,
        message: "Contest ID and type are required",
        error: null,
      });
    }

    const Contest = getModel(type);
    const contest = await Contest.findById(id);
    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found", error: null });
    }
    res.status(200).json({ success: true, data: { contest }, error: null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const createContest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { type, title, description, startTime, endTime, rules, questions } =
      req.body;
    if (!type || !title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Type, Title, Start Time, and End Time are required",
        error: null,
      });
    }

    const Contest = getModel(type);
    const contest = new Contest({
      title,
      description,
      startTime,
      endTime,
      rules,
      questions,
    });
    await contest.save();
    res.status(200).json({
      success: true,
      message: "Contest created successfully",
      data: { contest },
      error: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateContest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      contestId,
      type,
      title,
      description,
      startTime,
      endTime,
      rules,
      questions,
    } = req.body;
    if (!contestId || !type) {
      return res.status(400).json({
        success: false,
        message: "Contest ID and type are required",
        error: null,
      });
    }

    const Contest = getModel(type);
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found", error: null });
    }

    contest.title = title || contest.title;
    contest.description = description || contest.description;
    contest.startTime = startTime || contest.startTime;
    contest.endTime = endTime || contest.endTime;
    contest.rules = rules || contest.rules;
    contest.questions = questions || contest.questions;
    await contest.save();
    res.status(200).json({
      success: true,
      message: "Contest updated successfully",
      data: { contest },
      error: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteContest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { contestId, type } = req.body;
    if (!contestId || !type) {
      return res.status(400).json({
        success: false,
        message: "Contest ID and type are required",
        error: null,
      });
    }

    const Contest = getModel(type);
    const contest = await Contest.findByIdAndDelete(contestId);
    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found", error: null });
    }
    res.status(200).json({
      success: true,
      message: "Contest deleted successfully",
      data: null,
      error: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getContestParticipants = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id, type } = req.params;
    if (!id || !type) {
      return res.status(400).json({
        success: false,
        message: "Contest ID and type are required",
        error: null,
      });
    }

    const Contest = getModel(type);
    const contest = await Contest.findById(id);
    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found", error: null });
    }
    res.status(200).json({
      success: true,
      data: { participants: contest.participants },
      error: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getContestResults = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id, type } = req.params;
    if (!id || !type) {
      return res.status(400).json({
        success: false,
        message: "Contest ID and type are required",
        error: null,
      });
    }

    const Contest = getModel(type);
    const contest = await Contest.findById(id);
    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found", error: null });
    }
    interface ParticipantResult {
      studentId: string;
      score: number;
      status: string;
    }

    const results: ParticipantResult[] = contest.participants.map(
      (participant: { studentId: string; score: number; status: string }) => ({
        studentId: participant.studentId,
        score: participant.score,
        status: participant.status,
      })
    );
    res.status(200).json({ success: true, data: { results }, error: null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
