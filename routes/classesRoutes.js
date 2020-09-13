/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const classesController = require('./../controllers/classesController');
const classesValidation = require('./../controllers/middleware/validation/classesValidation');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.get(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  classesController.getAllClasses
);
router.post(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  classesValidation.addClass,
  classesController.addClass
);
router.get(
  '/subjects',
  protectedRoute,
  roleProtection.operator,
  roleProtection.teacher,
  roleProtection.student,
  roleProtection.parent,
  roleProtection.endMiddlewareChain,
  classesController.getAllSubjectsForClass
);
// router.get(
//   '/students',
//   protectedRoute,
//   roleProtection.teacher,
//   roleProtection.student,
//   roleProtection.parent,
//   roleProtection.operator,
//   roleProtection.endMiddlewareChain,
//   classesController.getAllStudentsFromClass
// );
router.get(
  '/students',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  classesController.getAllStudentsFromClass
);

module.exports = router;
