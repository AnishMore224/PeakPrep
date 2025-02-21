import mongoose, { Schema } from "mongoose";
import { IAsset } from "../types/collections";

const AssetSchema: Schema = new Schema({
  public_id: { type: String, required: true, unique: true },
  secure_url: { type: String, required: true },
  format: { type: String, required: true },
  resource_type: { type: String, required: true },
  created_at: { type: Date, required: true },
  bytes: { type: Number, required: true },
});

export default mongoose.model<IAsset>("Asset", AssetSchema);
