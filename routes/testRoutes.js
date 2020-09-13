/*
 * Created on Fri Aug 21 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */

const express = require('express');

const testController = require('./../controllers/testController');

const router = express.Router();

router.post('/', testController.announce);
router.delete('/', testController.delete);
router.get('/', testController.getAllTestsForClass);
router.get('/sender', testController.getAllTestsForSender);

module.exports = router;
