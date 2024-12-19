import express, { NextFunction, Request, Response } from 'express';
import { login, register } from '../controllers/auth';

var router = express.Router();

router.post('/register', register);

router.post('/login', login);

export default router;