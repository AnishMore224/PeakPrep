import express from 'express';
import { sendVerificationMail, PasswordResetMail, verifyCode, verifyAndUpdatePassword } from '../controllers/mail';
// Base URL: http://localhost:3030/api/mail
var router = express.Router();

router.post('/VerificationMail', sendVerificationMail);

router.post('/PasswordResetMail', PasswordResetMail);

router.post('/verifyCode', verifyCode);

router.post('/verifyAndUpdatePassword', verifyAndUpdatePassword);

export default router;
