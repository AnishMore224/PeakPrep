import express from 'express';
import { getUser, login, register, registerHr } from '../controllers/auth';
// Base URL: http://localhost:3030/api/auth
var router = express.Router();

router.post('/register', register);

router.post('/registerHr', registerHr);

router.post('/login', login);

router.get('/user', getUser);

export default router;