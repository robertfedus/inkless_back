/*
 * Created on Sat Aug 22 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */
const Admin = require('./../models/adminModel');

exports.createOperator = (req, res) => {
  const { body } = req;

  return Admin.createOperator(
    res,
    body.first_name,
    body.last_name,
    body.username,
    body.email,
    body.school_public_id,
    password => {
      res.status(200).json({
        status: 'success',
        message: 'Operator creat cu succes!',
        data: {
          password
        }
      });
    }
  );
};
