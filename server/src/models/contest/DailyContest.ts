import mongoose from "mongoose";

const DailyContestSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    rules: { type: String },

    participants: [{ 
        studentId: { type: String, ref: "Student" }, 
        score: { type: Number, default: 0 }, 
        status: { type: String, enum: ["Registered", "Completed"], default: "Registered" }
    }],

    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String }], // If MCQ
        correctAnswer: { type: String }, // Store correct answer
    }],

    submissions: [{
        studentId: { type: String, ref: "Student" },
        questionId: { type: mongoose.Schema.Types.ObjectId },
        answer: { type: String },
        score: { type: Number, default: 0 }
    }]
}, { timestamps: true });

export default mongoose.model("DailyContest", DailyContestSchema);