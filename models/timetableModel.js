/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');

exports.addTimetableClass = async (
  res,
  time,
  teacherPublicId,
  classGrade,
  classLetter,
  schoolPublicId,
  subjectPublicId,
  day,
  callback
) => {
  try {
    let queryString, queryArray;

    queryString = `
      INSERT INTO timetable(time, teacher_id, class_id, subject_id, day)
      VALUES(
        $1,
        (SELECT id FROM teachers WHERE user_id=(SELECT id FROM users WHERE public_id=$2)),
        (SELECT id FROM classes WHERE grade=$3 AND letter=$4 AND school_id=(
          SELECT id FROM schools WHERE public_id=$5
          )
        ),
        (SELECT id FROM subjects WHERE public_id=$6),
        $7
      )
    `;

    queryArray = [time, teacherPublicId, classGrade, classLetter, schoolPublicId, subjectPublicId, day];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getTimetableForClass = async (res, classPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT time, day, subjects.name AS subject, users.first_name AS teacher_first_name, 
        users.last_name AS teacher_last_name
      FROM timetable
      INNER JOIN subjects ON (subjects.id=timetable.subject_id)
      INNER JOIN teachers ON (teachers.id=timetable.teacher_id)
      INNER JOIN users ON (teachers.user_id=users.id)
      WHERE class_id=(SELECT id FROM classes WHERE public_id=$1)
      ORDER BY day
    `;

    queryArray = [classPublicId];

    const result = await db.query(queryString, queryArray);

    callback(result.rows);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.deleteTimetableClass = async (res, timetableClassPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      DELETE FROM timetable
      WHERE public_id=$1
    `;

    queryArray = [timetableClassPublicId];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.getAllTimetable = async (res, schoolPublicId, day, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT users.last_name, users.first_name, timetable.public_id AS hour_public_id,
        timetable.time, classes.grade, classes.letter, subjects.name AS subject_name
      FROM timetable
      INNER JOIN classes ON (classes.id=timetable.class_id)
      INNER JOIN teachers ON (timetable.teacher_id=teachers.id)
      INNER JOIN users ON (users.id=teachers.user_id)
      INNER JOIN subjects ON (subjects.id=timetable.subject_id)
      WHERE classes.school_id=(
        SELECT id FROM schools WHERE public_id=$1
      )
      AND timetable.day=$2
      ORDER BY timetable.time
    `;

    queryArray = [schoolPublicId, day];

    const result = await db.query(queryString, queryArray);
    const resultArray = result.rows;

    // var a = [
    //   { name: 'Foo', place: 'US', age: 15 },
    //   { name: 'Foo', place: 'UK', age: 21 },
    //   { name: 'Bar', place: 'Canada', age: 20 },
    //   { name: 'Bar', place: 'China', age: 22 }
    // ];

    const timetable = Object.values(
      resultArray.reduce((acc, { last_name, first_name, ...rest }) => {
        acc[last_name] = acc[last_name] || { name: `${last_name} ${first_name}`, hours: [] };
        acc[last_name].hours = [...acc[last_name].hours, rest];
        return acc;
      }, {})
    );

    callback(timetable);
  } catch (err) {
    return serverError(res, err);
  }
};
