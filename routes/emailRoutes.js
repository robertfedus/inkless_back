/*
 * Created on Fri Aug 14 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const emailController = require('./../controllers/emailController');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.post('/subscription', emailController.orderSubscription);
router.post(
  '/password',
  protectedRoute,
  roleProtection.operator,
  roleProtection.parent,
  roleProtection.student,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  emailController.requestPasswordReset
);
router.post(
  '/email',
  protectedRoute,
  roleProtection.operator,
  roleProtection.parent,
  roleProtection.student,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  emailController.requestEmailReset
);

module.exports = router;
