/*
 * Created on Fri Aug 07 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');

exports.addStudent = async (res, parentUsername, studentUsername, callback) => {
  try {
    // parentUsername si studentUsername vin din JWTs

    let queryString, queryArray;

    queryString = `
      INSERT INTO parents_students(parent_user_id, student_user_id)
      VALUES(
        (SELECT id FROM users WHERE username=$1),
        (SELECT id FROM users WHERE username=$2)
      )
    `;
    queryArray = [parentUsername, studentUsername];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};
