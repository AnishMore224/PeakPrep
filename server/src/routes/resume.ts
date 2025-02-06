import express from 'express';
import {isStudent } from '../middlewares/authenticate';
import { generatePdf } from '../controllers/resume';


var router = express.Router();

router.post('/',isStudent, generatePdf);

export default router;