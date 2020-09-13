/*
 * Created on Sat Sep 05 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */

const express = require('express');
const subjectsController = require('./../controllers/subjectsController');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.get(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  subjectsController.getAllSubjects
);

module.exports = router;
