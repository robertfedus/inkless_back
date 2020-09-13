/*
 * Created on Thu Jul 23 2020
 *
 * Copyright (c) 2020 One FPS
 */

const validationError = require('../../../utils/validationError');
const db = require('../../../db/index');

exports.addTimetableClass = async (req, res, next) => {
  const { body } = req;

  if (!body.time || !body.teacher_public_id || !body.subject_public_id || !body.day)
    return validationError(res, 400, 'Request eronat.');
  if (body.day < 1 || body.day > 5)
    return validationError(res, 400, '"day" poate lua valori numai intre 1 si 5.');

  let queryString, queryArray, result;

  queryString = `
    SELECT time FROM timetable
    WHERE class_id=(SELECT id FROM classes WHERE public_id=$1)
    AND day=$2
    AND time=$3
  `;

  queryArray = [body.class_public_id, body.day, body.time];

  result = await db.query(queryString, queryArray);

  if (result.rows[0]) return validationError(res, 409, `Clasa aceasta are deja o ora la ${body.time}`);

  queryString = `
    SELECT time, day
    FROM timetable
    INNER JOIN teachers ON (teachers.id=timetable.teacher_id)
    WHERE time=$1 AND day=$2 AND teacher_id=(
      SELECT id FROM teachers WHERE user_id=(SELECT id FROM users WHERE public_id=$3)
    )
  `;

  queryArray = [body.time, body.day, body.teacher_public_id];

  result = await db.query(queryString, queryArray);

  if (result.rows[0]) return validationError(res, 409, `Profesorul acesta are deja o ora la ${body.time}`);

  return next();
};
