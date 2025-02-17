import express from 'express';
import { joinContest, getCodingContests, getDailyContests, getContest, createContest, updateContest, deleteContest, getContestParticipants, getContestResults } from '../controllers/contest';
import { isAdmin, isStudent } from '../middlewares/authenticate';
// Base URL: http://localhost:3030/api/contest
const router = express.Router();

router.get('/dailycontests', getDailyContests);
router.get('/codingcontests', getCodingContests);
router.get('/:id/participants', getContestParticipants);
router.get('/:id/results', getContestResults);
router.get('/:type/:id', getContest);
router.post('/join', isStudent, joinContest);
router.post('/create', isAdmin, createContest);
router.put('/update', isAdmin, updateContest);
router.delete('/delete', isAdmin, deleteContest);

export default router;
