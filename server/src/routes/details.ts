import express, { NextFunction, Request, Response } from 'express';
import { companies, company, hr, hrs, student, students } from '../controllers/details';

var router = express.Router();

router.get('/students', students);
router.get('/student', student);
router.get('/companies', companies);
router.get('/company', company);
router.get('/hrs', hrs);
router.get('/hr', hr);


export default router;