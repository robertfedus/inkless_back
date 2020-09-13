/*
 * Created on Fri Aug 21 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */

const Test = require('./../models/testModel');

exports.announce = (req, res) => {
  const { body } = req;

  return Test.announce(
    res,
    body.date,
    body.teacher_user_public_id,
    body.class_public_id,
    body.subject_public_id,
    () => {
      res.status(200).json({
        status: 'success',
        message: 'Test anuntat cu succes!'
      });
    }
  );
};

exports.delete = (req, res) => {
  const { query } = req;

  return Test.delete(res, query.test_public_id, () => {
    res.status(200).json({
      status: 'success',
      message: 'Test sters cu succes!'
    });
  });
};

exports.getAllTestsForClass = (req, res) => {
  return Test.getAllTestsForClass(res, req.query.class_public_id, tests => {
    res.status(200).json({
      status: 'success',
      data: {
        tests
      }
    });
  });
};

exports.getAllTestsForSender = (req, res) => {
  return Test.getAllTestsForSender(res, req.query.teacher_user_public_id, tests => {
    res.status(200).json({
      status: 'success',
      data: {
        tests
      }
    });
  });
};
