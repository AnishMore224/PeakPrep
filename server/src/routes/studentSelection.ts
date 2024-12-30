import express from 'express';
import { isHrOrAdmin } from '../middlewares/authenticate';
import { addSelectedStudent, addShortlistStudent, getSelectedStudents, getShortlistedStudents, removeSelectedStudent, removeShortlistStudent, updateSelectedStudent, updateShortlistStudent } from '../controllers/studentSelection';


var router = express.Router();

router.post('/addSelectedStudents', isHrOrAdmin, addSelectedStudent);

router.post('updateSelectedStudents', isHrOrAdmin, updateSelectedStudent);

router.delete('removeSelectedStudents', isHrOrAdmin, removeSelectedStudent);

router.post('addShortlistedStudents', isHrOrAdmin, addShortlistStudent);

router.post('updateShortlistedStudents', isHrOrAdmin, updateShortlistStudent);

router.delete('removeShortlistedStudents', isHrOrAdmin, removeShortlistStudent);

router.get('/getSelectedStudents', isHrOrAdmin, getSelectedStudents);

router.get('/getShortlistedStudents', isHrOrAdmin, getShortlistedStudents);

export default router;