// routes/cloudinary.routes.ts
import { Router } from 'express';
import { getSignature, getSignedUrl, saveAsset } from '../controllers/cloudinary';

const router = Router();
// Base URL: http://localhost:3030/api/cloudinary
// Endpoint to generate a signature for Cloudinary uploads
router.get('/signature/:uploadPreset', getSignature);
router.get('/signed-url/:public_id', getSignedUrl);
router.post('/save', saveAsset);

export default router;
