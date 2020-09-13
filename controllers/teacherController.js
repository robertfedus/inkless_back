/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const Teacher = require('./../models/teacherModel');

exports.assignTeacherToClass = (req, res) => {
  const { body } = req;

  return Teacher.assignTeacherToClass(
    res,
    body.teacher_username,
    body.school_public_id,
    body.class_grade,
    body.class_letter,
    body.subject_public_id,
    () => {
      res.status(200).json({
        status: 'success',
        message: 'Profesor adaugat cu succes!'
      });
    }
  );
};

exports.deleteTeacherFromClass = (req, res) => {
  const { query } = req;

  return Teacher.deleteTeacherFromClass(
    res,
    query.teacher_username,
    query.school_public_id,
    query.class_grade,
    query.class_letter,
    () => {
      res.status(200).json({
        status: 'success',
        message: 'Profesor sters cu succes!'
      });
    }
  );
};

exports.getAllTeachers = (req, res) => {
  const { query } = req;

  return Teacher.getAllTeachers(res, query.school_public_id, teachers => {
    res.status(200).json({
      status: 'success',
      data: {
        teachers
      }
    });
  });
};

exports.getAllClassesFromTeacher = (req, res) => {
  const { query } = req;

  return Teacher.getAllClassesFromTeacher(res, query.teacher_public_id, classes => {
    res.status(200).json({
      status: 'success',
      data: {
        classes
      }
    });
  });
};

exports.getSubjectsForClass = (req, res) => {
  const { query } = req;

  return Teacher.getSubjectsForClass(res, query.class_public_id, query.teacher_user_public_id, subjects => {
    res.status(200).json({
      status: 'succes',
      data: {
        subjects
      }
    });
  });
};
