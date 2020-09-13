/*
 * Created on Thu Jul 09 2020
 *
 * Copyright (c) 2020 One FPS
 */

const db = require('./../db/index');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');
const serverError = require('./../utils/serverError');
const { teacher } = require('../controllers/middleware/authorization/roleProtection');

exports.createOne = async (body, query, res, callback) => {
  try {
    let password,
      username = body.username ? body.username : undefined;
    // prettier-ignore
    password = query.role === 'elev' || query.role === 'profesor' ? randomstring.generate(6) : body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (query.role === 'elev' || query.role === 'profesor') {
      username = body.first_name.toLowerCase() + body.last_name.toLowerCase() + `.${body.school}`;

      const usernameIndex = await checkUsernameRepetition(username);

      if (usernameIndex) {
        await updateUsernameRepetition(username, usernameIndex + 1, res);
        const usernameArray = username.split('.');
        usernameArray[0] += usernameIndex + 1;

        username = usernameArray.join('.');
      }
    }
    let email;
    if (query.role === 'parinte') email = body.email;

    const queryString =
      'INSERT INTO users(first_name, last_name, username, email, password, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING id';

    // prettier-ignore
    const queryArray = [body.first_name, body.last_name, username, email, hashedPassword, query.role];

    const result = await db.query(queryString, queryArray);

    // AICI SE SALVEAZA UTILIZATORUL IN TABELUL DE ELEVI
    const userId = result.rows[0].id;

    if (query.role === 'elev') {
      const student = saveStundent(body, userId);
      if (!student) throw new Error();
    } else if (query.role === 'profesor') {
      const teacher = await saveTeacher(
        body.class_grade,
        body.class_letter,
        userId,
        body.school,
        body.master
      );
      if (!teacher) throw new Error();
    }

    return callback({
      username,
      password: query.role === 'elev' || query.role === 'profesor' ? password : undefined
    });
  } catch (err) {
    return serverError(res, err);
  }
};

// Functia de mai jos functioneaza si la profesori!

const updateUsernameRepetition = async (username, index, res) => {
  try {
    // INDEX SE REFERA LA URMATOAREA VALOARE PE CARE O IA username_repetition
    const arr = [index, username];
    await db.query('UPDATE users SET username_repetition=$1 WHERE username=$2', arr);
  } catch (err) {
    return serverError(res, err);
  }
};

// DE REVIZUIT FUNCTIA saveStudent !!!
const saveStundent = async (body, userId) => {
  try {
    let queryString, queryArray, result;

    queryString = 'SELECT id FROM schools WHERE short_name=$1';
    queryArray = [body.school];
    result = await db.query(queryString, queryArray);
    const schoolId = result.rows[0].id;

    queryString = 'SELECT id FROM classes WHERE public_id=$1';
    queryArray = [body.class_public_id];
    result = await db.query(queryString, queryArray);
    const classId = result.rows[0].id;

    queryString = 'INSERT INTO students(class_id, school_id, user_id) VALUES($1, $2, $3)';
    queryArray = [classId, schoolId, userId];
    await db.query(queryString, queryArray);
  } catch (err) {
    return false;
  }
};

const saveTeacher = async (classGrade, classLetter, userId, schoolShortName, master) => {
  try {
    let queryString, queryArray;
    queryString = `
      INSERT INTO teachers(school_id, user_id)
      VALUES(
        (SELECT id FROM schools
          WHERE short_name=$1),
        $2)
      RETURNING id`;

    queryArray = [schoolShortName, userId];

    const result = await db.query(queryString, queryArray);

    const teacherId = result.rows[0].id;

    if (master) {
      queryString = `
    UPDATE classes 
    SET master_teacher_id=$1 
    WHERE grade=$2
    AND letter=$3
    AND school_id=(
      SELECT id FROM schools WHERE short_name=$4
    )
    `;
      queryArray = [teacherId, classGrade, classLetter, schoolShortName];
      await db.query(queryString, queryArray);
    }

    return true;
  } catch (err) {
    return false;
  }
};

exports.checkEmailRepetition = async email => {
  const queryString = 'SELECT * FROM users WHERE email=$1';
  const queryArray = [email];

  const user = await db.query(queryString, queryArray);
  if (user.rows[0]) return true;

  return false;
};

const checkUsernameRepetition = async username => {
  const queryString = 'SELECT username_repetition FROM users WHERE username=$1';
  const queryArray = [username];

  const user = await db.query(queryString, queryArray);

  if (user.rows[0]) return user.rows[0].username_repetition;

  return false;
};

exports.checkUsernameRepetition = checkUsernameRepetition;

exports.login = async (res, username, password, callback) => {
  try {
    let queryString,
      queryArray,
      result,
      tokenLineExists = false,
      refreshToken;

    queryString = `
      SELECT password, role, public_id, first_name, last_name
      FROM users WHERE username=$1
    `;

    queryArray = [username];

    result = await db.query(queryString, queryArray);

    // callback(true) inseamna ca a intervenit o eroare. In response va aparea 'Invalid credentials.'
    if (!result.rows[0]) return callback(undefined, true);

    const dbPassword = result.rows[0].password;
    const userRole = result.rows[0].role;
    const userPublicId = result.rows[0].public_id;
    const firstName = result.rows[0].first_name;
    const lastName = result.rows[0].last_name;

    const validPass = await bcrypt.compare(password, dbPassword);
    if (!validPass) return callback(undefined, true);

    // Verificam daca nu cumva exista deja linia corespunzatoare utilizatorului (in tabelul refresh_tokens)

    queryString = `
      SELECT token
      FROM refresh_tokens
      WHERE user_id=(
        SELECT id FROM users WHERE username=$1
      )
    `;

    result = await db.query(queryString, queryArray);

    if (result.rows && result.rows[0]) {
      tokenLineExists = true;
      refreshToken = result.rows[0].token;
    }

    if (!tokenLineExists) {
      // Aici inseram un refresh token
      queryString = `
      INSERT INTO refresh_tokens(user_id)
      VALUES(
        (SELECT id FROM users WHERE username=$1)
      )
      RETURNING token
    `;

      result = await db.query(queryString, queryArray);

      refreshToken = result.rows[0].token;
    }

    const jsonObject = {
      role: userRole,
      username
    };
    const jsonWebToken = jwt.sign(jsonObject, process.env.JWT_SECRET, { expiresIn: '1d' });

    let childrenRefreshTokens, schoolPublicId;

    if (userRole === 'parinte') {
      queryString = `
        SELECT token AS refresh_token, users.public_id AS user_public_id, 
          first_name AS child_first_name, last_name AS child_last_name, username AS child_username
        FROM parents_students
        INNER JOIN refresh_tokens ON (refresh_tokens.user_id=parents_students.student_user_id)
        INNER JOIN users ON (users.id=parents_students.student_user_id)
        WHERE parent_user_id=(
          SELECT id FROM users WHERE username=$1
        )
      `;

      result = await db.query(queryString, queryArray);

      childrenRefreshTokens = result.rows;
    }
    let schoolShortName;

    if (userRole === 'operator' || userRole === 'profesor') {
      let tableName;
      if (userRole === 'operator') tableName = 'operators';
      else tableName = 'teachers';

      queryString = `
          SELECT public_id, short_name
          FROM schools WHERE id=(
            SELECT school_id FROM ${tableName} WHERE user_id=(
              SELECT id FROM users WHERE username=$1
            )
          )
        `;
      result = await db.query(queryString, queryArray);
      schoolPublicId = result.rows[0].public_id;
      schoolShortName = result.rows[0].short_name;
    }

    let teacherMasterClassPublicId;
    if (userRole === 'profesor') {
      queryString = `
          SELECT public_id
          FROM classes WHERE master_teacher_id=(
            SELECT id FROM teachers WHERE user_id=(
              SELECT id FROM users WHERE username=$1
            )
          )
        `;
      result = await db.query(queryString, queryArray);
      teacherMasterClassPublicId = result.rows[0].public_id;
    }

    const data = {
      refresh_token: refreshToken,
      jwt: jsonWebToken,
      public_id: userPublicId,
      children_refresh_tokens: childrenRefreshTokens,
      role: userRole,
      school_public_id: schoolPublicId,
      school_short_name: schoolShortName,
      first_name: firstName,
      last_name: lastName,
      teacher_master_class_public_id: teacherMasterClassPublicId
    };

    callback(data, false);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.refresh = async (res, username, refreshToken, oldJwtObject, callback) => {
  delete oldJwtObject.iat;
  delete oldJwtObject.exp;

  const jwtObject = oldJwtObject;

  try {
    let queryString, queryArray;

    queryString = `
      SELECT * FROM refresh_tokens
      WHERE token=$1 AND user_id=(
        SELECT id FROM users WHERE username=$2
      )
    `;

    queryArray = [refreshToken, username];

    const result = await db.query(queryString, queryArray);

    if (result.rows[0]) {
      const jsonWebToken = jwt.sign(jwtObject, process.env.JWT_SECRET, { expiresIn: '1d' });
      callback(jsonWebToken, undefined);
    } else {
      callback(undefined, true);
    }
  } catch (err) {
    return serverError(res, err);
  }
};

/*
  Change normal user password se refera la orice utilizator care doreste sa-si schimbe parola.
  Mai exista si varianta cand operatorul schimba parola unui elev/profesor.
*/
exports.changeNormalUserPassword = async (res, username, oldPassword, newPassword, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT password FROM users WHERE username=$1
    `;

    queryArray = [username];

    const result = await db.query(queryString, queryArray);

    const dbPassword = result.rows[0].password;

    const validPass = await bcrypt.compare(oldPassword, dbPassword);
    if (!validPass) return callback(true);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    queryString = `
      UPDATE users SET password=$1 WHERE username=$2
    `;

    queryArray = [hashedPassword, username];

    await db.query(queryString, queryArray);

    callback(false);
  } catch (err) {
    return serverError(res, err);
  }
};

/* 
  - Change user password from OP se refera la abilitatea unui operator de a schimba parola unui elev/profesor.
  - Operatorul nu are nevoie de parola anterioara a elevului.
  - Functie folositoare atunci cand un elev/profesor isi uita parola.
  - De fapt nu se schimba parola, ci se genereaza una noua de 6 caractere.
*/
exports.changeUserPasswordFromOP = async (res, userUsername, callback) => {
  try {
    const newPassword = randomstring.generate(6);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    queryString = `
      UPDATE users SET password=$1 WHERE username=$2
    `;

    queryArray = [hashedPassword, userUsername];

    await db.query(queryString, queryArray);

    callback(newPassword);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.requestPasswordReset = async (res, email, callback) => {
  try {
    const code = Math.floor(Math.random() * 90000) + 10000;
    let queryString, queryArray;

    queryString = `
      INSERT INTO password_resets(user_id, code)
      VALUES(
        (SELECT id FROM users WHERE email=$1),
        $2
      )
    `;

    queryArray = [email, code];

    await db.query(queryString, queryArray);

    callback(code);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.checkPasswordResetCode = async (res, code, email, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT * FROM password_resets
      WHERE code=$1
      AND user_id=(
        SELECT id FROM users WHERE email=$2
      )
      AND expiry > CURRENT_TIMESTAMP
    `;

    queryArray = [code, email];

    const result = await db.query(queryString, queryArray);

    if (!result.rows[0]) {
      //Daca codul/emailul nu corespunde, trimitem eroare in callback
      callback(true);
    } else {
      callback(false);
    }
  } catch (err) {
    return serverError(res, err);
  }
};

exports.resetPasswordAfterCodeCheck = async (res, email, password, callback) => {
  try {
    let queryString, queryArray;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    queryString = `
      UPDATE users SET password=$1 WHERE email=$2
    `;

    queryArray = [hashedPassword, email];

    await db.query(queryString, queryArray);

    callback();
  } catch (err) {
    return serverError(res, err);
  }
};

exports.requestEmailReset = async (res, userPublicId, callback) => {
  try {
    const code = Math.floor(Math.random() * 90000) + 10000;
    let queryString, queryArray;

    queryString = `
      INSERT INTO email_resets(user_id, code)
      VALUES(
        (SELECT id FROM users WHERE public_id=$1),
        $2
      )
    `;

    queryArray = [userPublicId, code];

    await db.query(queryString, queryArray);

    callback(code);
  } catch (err) {
    return serverError(res, err);
  }
};

exports.checkEmailResetCode = async (res, code, userPublicId, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT * FROM email_resets
      WHERE code=$1
      AND user_id=(
        SELECT id FROM users WHERE public_id=$2
      )
      AND expiry > CURRENT_TIMESTAMP
    `;

    queryArray = [code, userPublicId];

    const result = await db.query(queryString, queryArray);

    if (!result.rows[0]) {
      //Daca codul/emailul nu corespunde, trimitem eroare in callback
      callback(true);
    } else {
      callback(false);
    }
  } catch (err) {
    return serverError(res, err);
  }
};

exports.resetEmailAfterCodeCheck = async (res, userPublicId, email, callback) => {
  try {
    let queryString, queryArray;

    queryString = `
      SELECT * FROM users
      WHERE email=$1
    `;
    queryArray = [email];

    const result = await db.query(queryString, queryArray);

    if (result.rows[0]) return callback(true);

    queryString = `
      UPDATE users SET email=$1 WHERE public_id=$2
    `;

    queryArray = [email, userPublicId];

    await db.query(queryString, queryArray);

    callback(false);
  } catch (err) {
    return serverError(res, err);
  }
};
