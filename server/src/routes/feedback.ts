import express from 'express';
import { isHr, isHrOrAdmin, isHrOrStudentOrAdmin, isStudent } from '../middlewares/authenticate';
import { addFeedback, feedback, feedbacks } from '../controllers/feedback';

var router = express.Router();

router.post('/addFeedback', isHrOrAdmin, addFeedback);

router.delete('/deleteFeedback', isHrOrAdmin, addFeedback);

router.post('/updateFeedback', isHrOrAdmin, addFeedback);

router.get('/feedbacks',isStudent,feedbacks);

router.get('/feedback',isHrOrStudentOrAdmin,feedback);


export default router;