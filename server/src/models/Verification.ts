import mongoose, { Schema } from "mongoose";
import { Verification } from "../types/collections";

const VerificationSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<Verification>("Verification", VerificationSchema);
