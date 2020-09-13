/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const timetableValidation = require('./../controllers/middleware/validation/timetableValidation');
const timetableController = require('./../controllers/timetableController');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.get('/', timetableController.getTimetableForClass);
router.post(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  timetableValidation.addTimetableClass,
  timetableController.addTimetableClass
);
router.delete(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  timetableController.deleteTimetableClass
);
router.get(
  '/all',
  protectedRoute,
  roleProtection.operator,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  timetableController.getAllTimetable
);

module.exports = router;
