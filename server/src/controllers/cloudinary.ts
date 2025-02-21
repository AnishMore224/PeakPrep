// controllers/cloudinary.controller.ts
import { Request, Response } from 'express';
import cloudinary from '../utils/cloudinary.config';
import Asset from '../models/Asset';

export const getSignature = async (req: Request, res: Response): Promise<any> => {
  try {
    // Calculate a timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    // Get the upload preset from the URL parameter (if needed)
    const uploadPreset = req.params.uploadPreset as string;

    // If you want to use the preset from the URL, replace "PeakPrepDocs" with uploadPreset
    const paramsToSign = {
      timestamp,
      upload_preset: uploadPreset || 'PeakPrepDocs',
    };

    // Generate signature using Cloudinary's utility method.
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    // Return the signature, timestamp, and upload preset to the client.
    res.status(200).json({
      success: true,
      data: {
        signature,
        timestamp,
        uploadPreset: paramsToSign.upload_preset,
      },
      error: null
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({
      success: false,
      data: null,
      error
    });
  }
};

export const getSignedUrl = async (req: Request, res: Response): Promise<any> => {
  try {
    const { public_id } = req.params;
    if (!public_id) {
      return res.status(400).json({ error: 'Missing public_id' });
    }

    const asset = await Asset.findOne({ public_id });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const signedUrl = cloudinary.url(public_id, {
      sign_url: true,
      secure: true,
      resource_type: 'raw',
      type: 'authenticated', // Ensure this matches your upload settings
      expires_at: Math.floor(Date.now() / 1000) + 3600, // URL valid for 1 hour
    });

    return res.status(200).json({
      success: true,
      data: { signedUrl },
      error: null
    });
    } catch (error) {
    console.error('Error generating signed URL:', error);
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to generate signed URL'
    });
  }
};

export const saveAsset = async (req: Request, res: Response): Promise<any> => {
  try {
    const { public_id, secure_url, format, resource_type, created_at, bytes } = req.body;
    if (!public_id || !secure_url || !format || !resource_type || !created_at || !bytes) {
      return res.status(400).json({ success: false, error: 'Missing required asset fields' });
    }
    const asset = new Asset({ public_id, secure_url, format, resource_type, created_at, bytes });
    await asset.save();
    return res.status(201).json({ success: true, data: asset });
  } catch (error) {
    console.error('Error saving asset:', error);
    return res.status(500).json({ success: false, error: 'Failed to save asset' });
  }
};