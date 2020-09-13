/*
 * Created on Fri Aug 07 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const parentController = require('./../controllers/parentController');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.post(
  '/student',
  protectedRoute,
  roleProtection.parent,
  roleProtection.endMiddlewareChain,
  parentController.addStudent
);

module.exports = router;
