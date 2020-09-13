/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */
const validationError = require('./../../../utils/validationError');
const db = require('./../../../db/index');

exports.addClass = (req, res, next) => {
  const body = req.body;

  if (!req.query.school_public_id || !body.grade || !body.letter)
    return validationError(res, 400, 'Request eronat.');

  return next();
};
