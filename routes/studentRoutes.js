/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const studentController = require('./../controllers/studentController');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.patch(
  '/class',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  studentController.updateClassForStudent
);
router.get('/messages', studentController.getAllMessagesForStudent);

module.exports = router;
