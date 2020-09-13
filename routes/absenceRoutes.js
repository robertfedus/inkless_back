/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');

const absenceController = require('./../controllers/absenceController');
const absenceValidation = require('./../controllers/middleware/validation/absenceValidation');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');
const router = express.Router();

router.post(
  '/',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  absenceValidation.addAbsence,
  absenceController.addAbsence
);
router.delete(
  '/',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  absenceController.deleteAbsence
);
router.patch(
  '/',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  absenceValidation.updateAbsence,
  absenceController.updateAbsence
);
router.get(
  '/absences',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.student,
  roleProtection.parent,
  roleProtection.endMiddlewareChain,
  absenceController.getAllAbsencesForOneSubject
);

module.exports = router;
