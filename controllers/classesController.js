/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const Classes = require('./../models/classesModel');

exports.getAllClasses = (req, res) => {
  return Classes.getAllClasses(res, req.query, result => {
    res.status(200).json({
      status: 'success',
      data: result
    });
  });
};

exports.addClass = (req, res) => {
  return Classes.addClass(res, req.body, req.query, (error, result) => {
    if (error)
      return res.status(error.code).json({
        status: 'fail',
        message: error.message
      });

    res.status(200).json({
      status: 'success',
      data: {
        class: result
      }
    });
  });
};

exports.getAllSubjectsForClass = (req, res) => {
  const { query } = req;

  return Classes.getAllSubjectsForClass(res, query.class_public_id, subjects => {
    res.status(200).json({
      status: 'success',
      data: {
        subjects
      }
    });
  });
};

exports.getAllStudentsFromClass = (req, res) => {
  const { query } = req;

  return Classes.getAllStudentsFromClass(res, query.class_public_id, students => {
    res.status(200).json({
      status: 'success',
      data: {
        students
      }
    });
  });
};
