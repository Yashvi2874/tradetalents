const express = require('express');
const router = express.Router();
const { 
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse
} = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.route('/')
  .get(getCourses)
  .post(auth, createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(auth, updateCourse)
  .delete(auth, deleteCourse);

router.route('/:id/enroll')
  .post(auth, enrollInCourse);

module.exports = router;