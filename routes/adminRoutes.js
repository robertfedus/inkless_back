/*
 * Created on Sat Aug 22 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */

const express = require('express');
const adminController = require('./../controllers/adminController');
const adminProtection = require('./../controllers/middleware/authorization/adminProtection');

const router = express.Router();

router.post('/operator', adminProtection, adminController.createOperator);

module.exports = router;
