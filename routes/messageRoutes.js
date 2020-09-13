/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const messageController = require('./../controllers/messageController');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

router.post(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  messageController.sendMessage
);
router.get(
  '/sender',
  protectedRoute,
  roleProtection.operator,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  messageController.getAllMessagesForSender
);
router.delete(
  '/',
  protectedRoute,
  roleProtection.operator,
  roleProtection.teacher,
  roleProtection.endMiddlewareChain,
  messageController.deleteMessage
);

module.exports = router;
