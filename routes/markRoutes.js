/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const markController = require('./../controllers/markController');
const markValidation = require('./../controllers/middleware/validation/markValidation');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.post(
  '/',
  protectedRoute,
  roleProtection.teacher,

  roleProtection.endMiddlewareChain,
  markValidation.addMark,
  markController.addMark
);
router.delete(
  '/',
  protectedRoute,
  roleProtection.teacher,

  roleProtection.endMiddlewareChain,
  markController.deleteMark
);
router.patch(
  '/',
  protectedRoute,
  roleProtection.teacher,

  roleProtection.endMiddlewareChain,
  markValidation.updateMark,
  markController.updateMark
);
router.get(
  '/marks',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.parent,
  roleProtection.student,
  roleProtection.endMiddlewareChain,
  markController.getAllMarksForOneSubject
);

module.exports = router;
