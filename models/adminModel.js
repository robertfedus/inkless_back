/*
 * Created on Sat Aug 22 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */

const db = require('./../db/index');
const randomstring = require('randomstring');
const serverError = require('./../utils/serverError');
const bcrypt = require('bcrypt');

exports.createOperator = async (res, firstName, lastName, username, email, schoolPublicId, callback) => {
  try {
    const password = randomstring.generate(6);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let queryString, queryArray;

    queryString = `
      INSERT INTO users(first_name, last_name, username, email, password, role)
      VALUES($1, $2, $3, $4, $5, 'operator')
      RETURNING id
    `;

    queryArray = [firstName, lastName, username, email, hashedPassword];

    const result = await db.query(queryString, queryArray);

    queryString = `
      INSERT INTO operators(user_id, school_id)
      VALUES($1, (SELECT id FROM schools WHERE public_id=$2))
    `;

    queryArray = [result.rows[0].id, schoolPublicId];

    await db.query(queryString, queryArray);

    callback(password);
  } catch (err) {
    return serverError(res, err);
  }
};
