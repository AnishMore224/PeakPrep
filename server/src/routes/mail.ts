import express from 'express';
import { sendVerificationMail, sendPasswordResetMail } from '../controllers/mail';
// Base URL: http://localhost:3030/api/mail
var router = express.Router();

router.post('/VerificationMail', sendVerificationMail);

router.post('/PasswordResetMail', sendPasswordResetMail);

export default router;
