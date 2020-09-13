/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const Timetable = require('./../models/timetableModel');

exports.addTimetableClass = (req, res) => {
  const { body } = req;

  return Timetable.addTimetableClass(
    res,
    body.time,
    body.teacher_public_id,
    body.class_grade,
    body.class_letter,
    body.school_public_id,
    body.subject_public_id,
    body.day,
    () => {
      res.status(200).json({
        status: 'success',
        message: 'Ora adaugata in orar cu succes!'
      });
    }
  );
};

exports.getTimetableForClass = (req, res) => {
  const { query } = req;

  return Timetable.getTimetableForClass(res, query.class_public_id, timetable => {
    res.status(200).json({
      status: 'success',
      data: {
        timetable
      }
    });
  });
};

exports.deleteTimetableClass = (req, res) => {
  const { query } = req;

  return Timetable.deleteTimetableClass(res, query.timetable_class_public_id, () => {
    res.status(200).json({
      status: 'success',
      message: 'Ora a fost stearsa cu succes din orar!'
    });
  });
};

exports.getAllTimetable = (req, res) => {
  const { query } = req;

  return Timetable.getAllTimetable(res, query.school_public_id, query.day, hours => {
    res.status(200).json({
      status: 'success',
      data: {
        hours
      }
    });
  });
};
