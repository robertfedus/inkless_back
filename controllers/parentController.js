/*
 * Created on Fri Aug 07 2020
 *
 * Copyright (c) 2020 One FPS
 */

const Parent = require('./../models/parentModel');
const jwt = require('jsonwebtoken');

exports.addStudent = (req, res) => {
  let parentUsername, studentUsername;
  parentUsername = req.username;
  // decodam numai JWT-ul elevului: cel al parintelui e decodat la authorization si vine din header
  const studentJwt = req.query.student_jwt;

  jwt.verify(studentJwt, process.env.JWT_SECRET, (err, data) => {
    // console.log(data);

    if (err) {
      if (err.expiredAt)
        return res.status(401).json({
          status: 'fail',
          message: 'Bearer token expired',
          error: 'token_expiration'
        });
    } else {
      studentUsername = data.username;
    }
  });

  return Parent.addStudent(res, parentUsername, studentUsername, () => {
    res.status(200).json({
      status: 'success',
      message: 'Elev adaugat cu succes in lista.'
    });
  });
};
