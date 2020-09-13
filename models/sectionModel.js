/*
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const serverError = require('./../utils/serverError');

// getAllSections se refera la toate profilele liceale
exports.getAllSections = async (res, callback) => {
  try {
    let queryString;

    queryString = `
      SELECT public_id, name 
      FROM sections
    `;

    const sections = await db.query(queryString, []);

    callback(sections.rows);
  } catch (err) {
    return serverError(res, err);
  }
};
