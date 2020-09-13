/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const Student = require('./../models/studentModel');

exports.updateClassForStudent = (req, res) => {
  const { body } = req;
  // body.student_public_id se refera la user public id!
  return Student.updateClassForStudent(
    res,
    body.grade,
    body.letter,
    body.school_public_id,
    body.student_public_id,
    () => {
      res.status(200).json({
        status: 'success',
        message: 'Clasa a fost actualizata cu succes!'
      });
    }
  );
};

exports.getAllMessagesForStudent = (req, res) => {
  const { query } = req;

  return Student.getAllMessagesForStudent(res, query.student_public_id, messages => {
    res.status(200).json({
      status: 'success',
      data: {
        messages
      }
    });
  });
};
