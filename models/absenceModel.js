/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');

exports.addAbsence = async (res, date, publicId, message, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      INSERT INTO absences(student_id, teacher_id, subject_id, message, semester${date ? ', date' : ''})
      VALUES(
        (SELECT id FROM students WHERE user_id=(SELECT id FROM users WHERE public_id=$1)),
        (SELECT id FROM teachers WHERE user_id=(SELECT id FROM users WHERE public_id=$2)),
        (SELECT id FROM subjects WHERE public_id=$3),
        $4,
        $5
        ${date ? ', $6' : ''}
      )
    `;

    queryArray = [publicId.student, publicId.teacher, publicId.subject, message, process.env.SEMESTER];

    if (date) queryArray.push(date);

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.motivateAbsence = async (res, absencePublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      UPDATE absences 
      SET motivated=true
      WHERE public_id=$1
    `;

    queryArray = [absencePublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllAbsencesForOneSubject = async (res, studentPublicId, subjectPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT date, semester, message, first_name AS teacher_first_name, motivated,
      last_name as teacher_last_name, absences.public_id
      FROM absences 
      INNER JOIN teachers ON (teachers.id=absences.teacher_id) 
      INNER JOIN users ON (teachers.user_id=users.id) 
      WHERE student_id=(SELECT id FROM students WHERE user_id=(SELECT id FROM users WHERE public_id=$1)) 
      AND subject_id=(SELECT id FROM subjects WHERE public_id=$2) 
      ORDER BY date DESC
    `;
    queryArray = [studentPublicId, subjectPublicId];

    const marks = await db.query(queryString, queryArray);

    callback(marks.rows);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.deleteAbsence = async (res, absencePublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      DELETE FROM absences WHERE public_id=$1
    `;

    queryArray = [absencePublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.updateAbsence = async (res, field, value, absencePublicId, callback) => {
  try {
    let updatedColumn = '';
    switch (field) {
      case 'date':
        updatedColumn += 'date';
        break;
      case 'message':
        updatedColumn += 'message';
        break;
      case 'motivated':
        updatedColumn += 'motivated';
        break;
      default:
        throw new Error(`Column ${field} does not exist in the absences table.`);
    }

    let queryString, queryArray;
    queryString = `
     UPDATE absences SET ${updatedColumn}=$1 
     WHERE public_id=$2
   `;

    queryArray = [value, absencePublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};
