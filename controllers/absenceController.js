/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const Absence = require('./../models/absenceModel');

exports.addAbsence = (req, res) => {
  const { body } = req;

  const publicIds = {
    student: body.student_public_id,
    teacher: body.teacher_public_id,
    subject: body.subject_public_id
  };
  return Absence.addAbsence(res, body.date, publicIds, body.message, () => {
    res.status(200).json({
      status: 'success',
      message: 'Absenta adaugata cu succes!'
    });
  });
};

exports.motivateAbsence = (req, res) => {
  const { query } = req;

  return Absence.motivateAbsence(res, query.absence_public_id, () => {
    res.status(200).json({
      status: 'success',
      message: 'Absenta motivata cu succes!'
    });
  });
};

exports.getAllAbsencesForOneSubject = (req, res) => {
  const { query } = req;

  return Absence.getAllAbsencesForOneSubject(
    res,
    query.student_public_id,
    query.subject_public_id,
    absences => {
      res.status(200).json({
        data: {
          absences
        }
      });
    }
  );
};

exports.deleteAbsence = (req, res) => {
  const { query } = req;

  return Absence.deleteAbsence(res, query.absence_public_id, () => {
    res.status(200).json({
      status: 'success',
      message: 'Absenta stearsa cu succes!'
    });
  });
};

exports.updateAbsence = (req, res) => {
  const { query, body } = req;

  return Absence.updateAbsence(res, query.field, body.value, query.absence_public_id, () => {
    res.status(200).json({
      status: 'success',
      message: 'Absenta actualizata cu succes!'
    });
  });
};
