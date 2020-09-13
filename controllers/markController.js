/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */
const Mark = require('./../models/markModel');

exports.addMark = (req, res) => {
  return Mark.addMark(res, req.query, req.body, () => {
    res.status(200).json({
      status: 'success',
      message: 'Nota adaugata cu succes!'
    });
  });
};

exports.getAllMarksForOneSubject = (req, res) => {
  const { query } = req;

  return Mark.getAllMarksForOneSubject(res, query.student_public_id, query.subject_public_id, marks => {
    res.status(200).json({
      status: 'success',
      data: {
        marks
      }
    });
  });
};

exports.deleteMark = (req, res) => {
  return Mark.deleteMark(res, req.query.mark_public_id, () => {
    res.status(200).json({
      status: 'success',
      message: 'Nota stearsa cu succes!'
    });
  });
};

exports.updateMark = (req, res) => {
  const { body } = req;
  return Operator.updateMark(res, req.query.field, body.value, req.query.mark_public_id, () => {
    res.status(200).json({
      status: 'success',
      message: 'Nota actualizata cu succes!'
    });
  });
};
