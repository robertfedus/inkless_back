/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const teacherController = require('./../controllers/teacherController');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.post(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  teacherController.assignTeacherToClass
);
router.delete(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  teacherController.deleteTeacherFromClass
);
router.get('/classes', teacherController.getAllClassesFromTeacher);
router.get(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  teacherController.getAllTeachers
);
router.get('/subjects', teacherController.getSubjectsForClass);

module.exports = router;
