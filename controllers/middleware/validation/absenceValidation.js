/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const validationError = require('./../../../utils/validationError');

exports.addAbsence = (req, res, next) => {
  const { query, body } = req;

  // if (!query.semester) return validationError(res, 400, 'Request eronat.');

  if (!body.student_public_id || !body.teacher_public_id || !body.subject_public_id || !body.message)
    return validationError(res, 400, 'Request eronat.');

  return next();
};

exports.updateAbsence = (req, res, next) => {
  const { query, body } = req;
  if (!body.value) return validationError(res, 400, 'Request eronat.');

  if (!query.absence_public_id || !query.field) return validationError(res, 400, 'Request eronat.');

  if (body.value && body.value === '') return validationError(res, 400, '"value" nu poate fi gol.');

  return next();
};
