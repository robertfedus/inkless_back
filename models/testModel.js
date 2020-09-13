/*
 * Created on Fri Aug 21 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');
const { teacher } = require('../controllers/middleware/authorization/roleProtection');

exports.announce = async (res, date, teacherUserPublicId, classPublicId, subjectPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      INSERT INTO tests(due, teacher_id, class_id, subject_id)
      VALUES(
        $1,
        (SELECT id FROM teachers WHERE user_id=(
          SELECT id FROM users WHERE public_id=$2
          )
        ),
        (SELECT id FROM classes WHERE public_id=$3),
        (SELECT id FROM subjects WHERE public_id=$4)
      )
    `;

    queryArray = [date, teacherUserPublicId, classPublicId, subjectPublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.delete = async (res, testPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      DELETE FROM tests WHERE public_id=$1
    `;

    queryArray = [testPublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllTestsForClass = async (res, classPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT 
        tests.due, 
        subjects.name AS subject, 
        users.first_name AS teacher_first_name, 
        users.last_name AS teacher_last_name
      FROM tests
      INNER JOIN subjects ON (subjects.id=tests.subject_id)
      INNER JOIN teachers ON (teachers.id=tests.teacher_id)
      INNER JOIN users ON (users.id=teachers.user_id)
      WHERE class_id=(
        SELECT id FROM classes WHERE public_id=$1
      )
    `;

    queryArray = [classPublicId];

    const tests = await db.query(queryString, queryArray);

    callback(tests.rows);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllTestsForSender = async (res, teacherUserPublicId, callback) => {
  try {
    let queryString, queryArray;
    queryString = `
      SELECT 
        tests.due, 
        classes.grade AS class_grade,
        classes.letter AS class_letter,
        subjects.name AS subject,
        tests.public_id
      FROM tests
      INNER JOIN classes ON (classes.id=tests.class_id)
      INNER JOIN subjects ON (subjects.id=tests.subject_id)
      WHERE teacher_id=(
        SELECT id FROM teachers WHERE user_id=(
          SELECT id FROM users WHERE public_id=$1
        )
      )
      ORDER BY due DESC
    `;

    queryArray = [teacherUserPublicId];

    const tests = await db.query(queryString, queryArray);

    callback(tests.rows);
  } catch (err) {
    return serverError(res, err);
  }
};
