import express, { NextFunction, Request, Response } from 'express';
import { addHr, deleteHr } from '../controllers/adminControls';
import { isAdmin } from '../middlewares/authenticate';

var router = express.Router();

router.post('/addhr', isAdmin, addHr);
router.post('/deletehr', isAdmin, deleteHr);

export default router;