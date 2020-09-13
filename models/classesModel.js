/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');

exports.getAllClasses = async (res, query, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT classes.public_id, grade, letter
      FROM classes
      INNER JOIN schools ON (schools.id=classes.school_id) AND (schools.public_id=$1)
      ORDER BY grade, letter`;
    queryArray = [query.school_public_id];

    const result = await db.query(queryString, queryArray);

    callback(result.rows);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.addClass = async (res, body, urlQuery, callback) => {
  try {
    const classExists = await checkClassRepetition(res, body.grade, body.letter, urlQuery.school_public_id);
    if (classExists) {
      const error = {
        code: 409,
        message: 'Clasa exista deja.'
      };
      return callback(error, null);
    }

    let queryString, queryArray;

    queryString = `
    INSERT INTO classes(grade, letter, school_id)
    VALUES($1, $2, (SELECT id FROM schools WHERE public_id=$3))
    RETURNING public_id`;
    // prettier-ignore
    queryArray = [body.grade, body.letter, urlQuery.school_public_id]

    const result = await db.query(queryString, queryArray);
    const data = {
      public_id: result.rows[0].public_id,
      grade: body.grade,
      letter: body.letter,
      school_public_id: urlQuery.school_public_id
    };

    callback(null, data);
  } catch (err) {
    return serverError(res, err);
  }
};

const checkClassRepetition = async (res, grade, letter, schoolPublicId) => {
  try {
    const queryString = `
      SELECT * FROM classes 
      WHERE grade=$1 AND letter=$2 AND school_id=(SELECT id FROM schools WHERE public_id=$3)
    `;
    const queryArray = [grade, letter, schoolPublicId];

    const user = await db.query(queryString, queryArray);
    if (user.rows[0]) return true;

    return false;
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllSubjectsForClass = async (res, classPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT subjects.name, users.first_name AS teacher_first_name, users.last_name AS teacher_last_name,
      subjects.public_id AS subject_public_id
      FROM teachers_classes
      INNER JOIN classes ON (classes.id=teachers_classes.class_id)
      INNER JOIN subjects ON (subjects.id=teachers_classes.subject_id)
      INNER JOIN teachers ON (teachers.id=teachers_classes.teacher_id)
      INNER JOIN users ON (users.id=teachers.user_id)
      WHERE class_id=(SELECT id FROM classes WHERE public_id=$1)
    `;

    queryArray = [classPublicId];

    const subjects = await db.query(queryString, queryArray);

    callback(subjects.rows);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllStudentsFromClass = async (res, classPublicId, callback) => {
  try {
    // teacherPublicId se refera la user id!!!
    let queryString, queryArray;

    queryString = `
      SELECT first_name, last_name, username, email, public_id AS user_public_id
      FROM users 
      INNER JOIN students ON (students.class_id=(SELECT id FROM classes WHERE public_id=$1)) 
      AND (students.user_id=users.id)
      ORDER BY last_name
    `;

    queryArray = [classPublicId];

    const students = await db.query(queryString, queryArray);

    callback(students.rows);
  } catch (err) {
    return serverError(res, err);
  }
};
