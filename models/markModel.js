/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');

exports.addMark = async (res, reqQuery, body, callback) => {
  try {
    let queryString, queryArray;
    console.log(body);
    // DIN QUERY: semester, thesis
    // DIN BODY: student_public_id, teacher_public_id, subject_public_id, value, message
    // UNDE student_public_id si teacher_public_id se refera la user public id!!!

    queryString = `
      INSERT INTO marks(student_id, teacher_id, subject_id, semester, value, message, thesis ${
        body.date ? ', date' : ''
      }) 
      VALUES(
        (SELECT id FROM students WHERE user_id=(SELECT id FROM users WHERE public_id=$1)),
        (SELECT id FROM teachers WHERE user_id=(SELECT id FROM users WHERE public_id=$2)),
        (SELECT id FROM subjects WHERE public_id=$3),
        $4, $5, $6, $7${body.date ? ', $8' : ''}
      )`;

    queryArray = [
      body.student_public_id, // $1
      body.teacher_public_id, // $2
      body.subject_public_id, // $3
      process.env.SEMESTER, // $4
      body.value, // $5
      body.message, // $6
      reqQuery.thesis // $7
    ];

    // $8
    if (body.date) queryArray.push(body.date);

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllMarksForOneSubject = async (res, studentPublicId, subjectPublicId, callback) => {
  try {
    // studentPublicId se refera la user public id.
    // DE MAI ADAUGAT NOTE, PROFESORI SI TESTAT
    let queryString, queryArray;

    queryString = `
      SELECT date, semester, value, message, thesis, first_name AS teacher_first_name,
      last_name as teacher_last_name, marks.public_id
      FROM marks 
      INNER JOIN teachers ON (teachers.id=marks.teacher_id) 
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

exports.deleteMark = async (res, markPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      DELETE FROM marks WHERE public_id=$1
    `;
    queryArray = [markPublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.updateMark = async (res, field, value, markPublicId, callback) => {
  try {
    /*
    value din parametrii se refera la valoarea pe care o ia campul ce se actualizeaza!!
    Nu se refera la coloana value din tabelul marks!!
    */
    let updatedColumn = '';
    switch (field) {
      case 'date':
        updatedColumn += 'date';
        break;

      case 'value':
        updatedColumn += 'value';
        break;

      case 'message':
        updatedColumn += 'message';
        break;

      case 'thesis':
        updatedColumn += 'thesis';
        break;
    }

    let queryString, queryArray;
    queryString = `
      UPDATE marks SET ${updatedColumn}=$1 
      WHERE public_id=$2
    `;

    queryArray = [value, markPublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};
