import express from 'express';
import { isHr, isHrOrAdmin, isHrOrStudentOrAdmin, isStudent } from '../middlewares/authenticate';
import { addFeedback, deleteFeedback, feedback, feedbacks, updateFeedback } from '../controllers/feedback';

var router = express.Router();

router.post('/addFeedback', isHrOrAdmin, addFeedback);

router.delete('/deleteFeedback', isHrOrAdmin, deleteFeedback);

router.post('/updateFeedback', isHrOrAdmin, updateFeedback);

router.get('/feedbacks',isStudent,feedbacks);

router.get('/feedback',isHrOrStudentOrAdmin,feedback);


export default router;