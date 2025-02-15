import mongoose from "mongoose";

const CodingContestSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    rules: { type: String },

    participants: [{ 
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, 
        score: { type: Number, default: 0 }, 
        status: { type: String, enum: ["Registered", "Completed"], default: "Registered" }
    }],

    questions: [{
        questionId: { type: mongoose.Schema.Types.ObjectId },
        title: { type: String, required: true },
        description: { type: String },
        inputInstructions: { type: String },
        outputInstructions: { type: String },
        example: {
            input: { type: String, required: true },
            output: { type: String, required: true },
            explanation: { type: String }
        },
        testCases: [{
            input: { type: String, required: true },  // Input for the test case
            expectedOutput: { type: String, required: true }  // Expected output
        }]
    }],

    submissions: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        answer: { type: String },  // Stores user's submitted code
        score: { type: Number, default: 0 }
    }]
}, { timestamps: true });

const CodingContest = mongoose.model("CodingContest", CodingContestSchema);

export default CodingContest;
