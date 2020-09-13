/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const sectionController = require('./../controllers/sectionController');

const router = express.Router();

router.get('/', sectionController.getAllSections);

module.exports = router;
