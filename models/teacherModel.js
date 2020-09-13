/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');

// prettier-ignore
exports.assignTeacherToClass = async (res,
  teacherUsername, schoolPublicId, classGrade, classLetter, subjectPublicId, callback) => {

  try {
    let queryString, queryArray;
    queryString = `
      INSERT INTO teachers_classes(teacher_id, class_id, subject_id)
      VALUES(
        (SELECT id FROM teachers WHERE user_id=(
          SELECT id FROM users WHERE username=$1
          )
        ),
      (SELECT id FROM classes 
        WHERE school_id=(
        SELECT id FROM schools WHERE public_id=$2
        )
        AND grade=$3 AND letter=$4
      ),
      (SELECT id FROM subjects WHERE public_id=$5))`;
    queryArray = [teacherUsername, schoolPublicId, classGrade, classLetter, subjectPublicId];
    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

// prettier-ignore
exports.deleteTeacherFromClass = async (res, teacherUsername, schoolPublicId, classGrade, classLetter, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
    DELETE FROM teachers_classes
    WHERE teacher_id=(SELECT id FROM teachers WHERE user_id=(SELECT id FROM users WHERE username=$1))
    AND class_id=(SELECT id FROM classes WHERE school_id=(
      SELECT id FROM schools WHERE public_id=$2
      )
    AND grade=$3 AND letter=$4
    )
    `;
    queryArray = [teacherUsername, schoolPublicId, classGrade, classLetter];
    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllTeachers = async (res, schoolPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT first_name, last_name, users.public_id as user_public_id, username
      FROM users
      INNER JOIN teachers ON (teachers.user_id=users.id)
      AND (teachers.school_id=(SELECT id FROM schools WHERE public_id=$1))
    `;
    queryArray = [schoolPublicId];
    const teachers = await db.query(queryString, queryArray);

    callback(teachers.rows);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllClassesFromTeacher = async (res, teacherPublicId, callback) => {
  try {
    // teacherPublicId se refera la user id!!!
    let queryString, queryArray;

    queryString = `
      SELECT grade, letter, classes.public_id AS class_public_id, subjects.name AS subject, 
        subjects.public_id AS subject_public_id 
      FROM classes 
      INNER JOIN teachers_classes ON (teachers_classes.class_id=classes.id) 
      AND (teachers_classes.teacher_id=(SELECT id FROM teachers WHERE user_id=(
        SELECT id FROM users WHERE public_id=$1)))
      INNER JOIN subjects ON (teachers_classes.subject_id=subjects.id)
      ORDER BY grade
    `;
    queryArray = [teacherPublicId];

    const classes = await db.query(queryString, queryArray);

    callback(classes.rows);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getSubjectsForClass = async (res, classPublicId, teacherUserPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT
        subjects.public_id AS subject_public_id,
        subjects.name AS subject_name
      FROM teachers_classes
      INNER JOIN subjects ON (subjects.id=teachers_classes.subject_id)
      WHERE class_id=(
        SELECT id FROM classes WHERE public_id=$1
      )
      AND teacher_id=(
        SELECT id FROM teachers WHERE user_id=(
          SELECT id FROM users WHERE public_id=$2
        )
      )
    `;

    queryArray = [classPublicId, teacherUserPublicId];

    const result = await db.query(queryString, queryArray);

    callback(result.rows);
  } catch (err) {
    return serverError(res, err);
  }
};
