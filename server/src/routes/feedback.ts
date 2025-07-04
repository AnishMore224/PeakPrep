import express from 'express';
import { isHr, isHrOrAdmin, isHrOrStudentOrAdmin, isStudent } from '../middlewares/authenticate';
import { addFeedback, deleteFeedback, getFeedback, getFeedbacks, getRecentFeedback, updateFeedback } from '../controllers/feedback';
// Base URL: http://localhost:3030/api/feedback
var router = express.Router();

router.post('/addFeedback', isHrOrAdmin, addFeedback);

router.delete('/deleteFeedback', isHrOrAdmin, deleteFeedback);

router.post('/updateFeedback', isHrOrAdmin, updateFeedback);

router.get('/feedbacks',isStudent, getFeedbacks);

router.get('/feedback',isHrOrStudentOrAdmin, getFeedback);

router.get('/recent', isHrOrAdmin, getRecentFeedback);

export default router;