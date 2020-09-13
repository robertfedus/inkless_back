/*
 * Created on Sat Sep 05 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */
const db = require('./../db/index');
const serverError = require('./../utils/serverError');

exports.getAllSubjects = async (req, res) => {
  try {
    const { query } = req;
    let queryString;

    queryString = `
      SELECT name, public_id
      FROM subjects
    `;

    const result = await db.query(queryString, []);

    return res.status(200).json({
      status: 'success',
      data: {
        subjects: result.rows
      }
    });
  } catch (err) {
    return serverError(res, err);
  }
};
