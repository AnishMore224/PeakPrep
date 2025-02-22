// controllers/cloudinary.controller.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.config";
import Asset from "../models/Asset";
import { response } from "../types/response";
import Student from "../models/Student";
import HR from "../models/HR";
import Admin from "../models/Admin";

export const getSignature = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Calculate a timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    // Get the upload preset from the URL parameter (if needed)
    const uploadPreset = req.params.uploadPreset as string;

    // If you want to use the preset from the URL, replace "PeakPrepDocs" with uploadPreset
    const paramsToSign = {
      timestamp,
      upload_preset: uploadPreset || "PeakPrepDocs",
    };

    // Generate signature using Cloudinary's utility method.
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    // Return the signature, timestamp, and upload preset to the client.
    res.status(200).json({
      ...response,
      success: true,
      data: {
        signature,
        timestamp,
        uploadPreset: paramsToSign.upload_preset,
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      ...response,
      success: false,
      data: null,
      error,
    });
  }
};

export const getSignedUrl = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { public_id } = req.params;
    if (!public_id) {
      return res.status(400).json({ ...response, error: "Missing public_id" });
    }

    const asset = await Asset.findOne({ public_id });
    if (!asset) {
      return res.status(404).json({ ...response, error: "Asset not found" });
    }

    const signedUrl = cloudinary.url(public_id, {
      sign_url: true,
      secure: true,
      resource_type: "raw",
      type: "authenticated", // Ensure this matches your upload settings
      expires_at: Math.floor(Date.now() / 1000) + 3600, // URL valid for 1 hour
    });

    return res.status(200).json({
      ...response,
      success: true,
      data: { signedUrl },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      ...response,
      success: false,
      data: null,
      error: "Failed to generate signed URL",
    });
  }
};

export const saveAsset = async (req: Request, res: Response): Promise<any> => {
  try {
    const { public_id, secure_url, format, resource_type, created_at, bytes } =
      req.body;
    if (
      !public_id ||
      !secure_url ||
      !format ||
      !resource_type ||
      !created_at ||
      !bytes
    ) {
      return res
        .status(400)
        .json({ ...response, error: "Missing required asset fields" });
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ ...response, error: "Unauthorized" });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const asset = new Asset({
      public_id,
      secure_url,
      format,
      resource_type,
      created_at,
      bytes,
    });
    const { role, username } = decoded as any;
    if (role === "student") {
      const student = (await Student.findOne({ _id: username }).select(
        "assets"
      )) as any;
      student.assets.push(asset._id);
      await student.save();
    } else if (role === "hr") {
      const hr = (await HR.findOne({
        email: username,
      }).select("assets")) as any;
      hr.assets.push(asset._id);
      await hr.save();
    } else if (role === "admin") {
      const admin = (await Admin.findOne({
        email: username,
      }).select("assets")) as any;
      admin.assets.push(asset._id);
      await admin.save();
    }
    await asset.save();
    return res.status(201).json({
      ...response,
      success: true,
      message: "Asset saved successfully",
      data: asset,
    });
  } catch (error) {
    return res.status(500).json({ ...response, error: "Failed to save asset" });
  }
};

export const getAssets = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ ...response, error: "Unauthorized" });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const { role, username } = decoded as any;

    if (role === "student") {
      const student = (await Student.findOne({ _id: username }).populate(
        "assets"
      )) as any;
      return res.status(200).json({
        ...response,
        success: true,
        data: {
          assets: student.assets,
        },
      });
    } else if (role === "hr") {
      const hr = (await HR.findOne({ email: username }).populate(
        "assets"
      )) as any;
      return res.status(200).json({
        ...response,
        success: true,
        data: {
          assets: hr.assets,
        },
      });
    } else if (role === "admin") {
      const admin = (await Admin.findOne({ email: username }).populate(
        "assets"
      )) as any;
      return res.status(200).json({
        ...response,
        success: true,
        data: {
          assets: admin.assets,
        },
      });
    }
    return res.status(404).json({ ...response, error: "User not found" });
  } catch (error) {
    return res.status(500).json({ ...response, error: "Failed to get assets" });
  }
};

export const deleteAsset = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const public_id = req.body.public_id as string;
    const resource_type = req.body.resource_type as string;
    if (!public_id) {
      return res.status(400).json({ ...response, error: "Missing public_id" });
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ ...response, error: "Unauthorized" });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const studentId = decoded.username;
    const asset = (await Asset.findOne({ public_id })) as any;
    if (!asset) {
      return res.status(404).json({ ...response, error: "Asset not found" });
    }
    const student = (await Student.findOne({ _id: studentId }).select(
      "assets"
    )) as any;
    if (!student) {
      return res.status(404).json({ ...response, error: "Student not found" });
    }
    const cloudinaryResponse = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });
    if (cloudinaryResponse.result !== "ok") {
      return res
        .status(500)
        .json({ ...response, error: "Failed to delete from Cloudinary" });
    }
    student.assets = student.assets.filter(
      (assetId: any) => assetId.toString() !== asset._id.toString()
    );
    await student.save();
    await Asset.deleteOne({ public_id });

    return res.status(200).json({
      ...response,
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ...response, error: "Failed to delete asset" });
  }
};