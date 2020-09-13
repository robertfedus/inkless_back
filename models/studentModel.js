/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');

exports.updateClassForStudent = async (res, grade, letter, schoolPublicId, studentPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      UPDATE students SET class_id=(SELECT id FROM classes 
        WHERE grade=$1 
        AND letter=$2 
        AND school_id=(
          SELECT id FROM schools WHERE public_id=$3
        )
      )
      WHERE user_id=(SELECT id FROM users WHERE public_id=$4)
    `;

    queryArray = [grade, letter, schoolPublicId, studentPublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllMessagesForStudent = async (res, studentPublicId, callback) => {
  try {
    let queryString, queryArray;
    // studentPublicId e user public id!

    queryString = `
      SELECT time, message, first_name AS sender_first_name, last_name AS sender_last_name
      FROM messages 
      INNER JOIN messages_students ON (messages_students.student_id=(
        SELECT id FROM students WHERE user_id=(
          SELECT id FROM users WHERE public_id=$1
          )
        )
      )
      INNER JOIN messages_classes ON (class_id=(
        SELECT class_id FROM students WHERE user_id=(
          SELECT id FROM users WHERE public_id=$1
          )
        )
      )
      INNER JOIN users ON (users.id=messages.sender_user_id)
    `;
    queryArray = [studentPublicId];

    const messages = await db.query(queryString, queryArray);
    callback(messages.rows);
  } catch (err) {
    return serverError(res, err);
  }
};
