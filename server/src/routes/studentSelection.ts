import express from 'express';
import { isHr, isHrOrAdmin, isStudentOrAdmin } from '../middlewares/authenticate';
import { addSelectedStudent, addShortlistStudent, getSelectedStudents, getShortlistedStudents, removeSelectedStudent, removeShortlistStudent, students, updateSelectedStudent, updateShortlistStudent } from '../controllers/studentSelection';
import { getStudentSelections } from '../controllers/details';


var router = express.Router();

router.post('/addSelectedStudents', isHrOrAdmin, addSelectedStudent);

router.post('/updateSelectedStudents', isHrOrAdmin, updateSelectedStudent);

router.delete('/removeSelectedStudents', isHrOrAdmin, removeSelectedStudent);

router.post('/addShortlistedStudents', isHrOrAdmin, addShortlistStudent);

router.post('/updateShortlistedStudents', isHrOrAdmin, updateShortlistStudent);

router.delete('/removeShortlistedStudents', isHrOrAdmin, removeShortlistStudent);

router.get('/getSelectedStudents', isHrOrAdmin, getSelectedStudents);

router.get('/getShortlistedStudents', isHrOrAdmin, getShortlistedStudents);

router.get('/companies', isStudentOrAdmin, getStudentSelections);

router.get('/students', isHr, students);

export default router;