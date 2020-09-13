/*
 * Created on Thu Jul 09 2020
 *
 * Copyright (c) 2020 One FPS
 */

const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  return User.createOne(req.body, req.query, res, data => {
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

exports.login = (req, res) => {
  const { body } = req;

  return User.login(res, body.username, body.password, (data, error) => {
    let message;

    if (error) {
      message = 'Numele de utilizator și parola nu coincid.';

      return res.status(401).json({
        status: 'fail',
        message
      });
    }
    res.status(200).json({
      status: 'success',
      data
    });
  });
};

/* La functia refresh putem adauga, 
pe viitor, feature de a verifica inainte daca jwt-ul a expirat intr-adevar
inainte de a face request*/
exports.refresh = (req, res) => {
  const { query } = req;
  const oldToken = query.jwt;
  const refreshToken = query.refresh_token;
  console.log(oldToken);

  jwt.verify(oldToken, process.env.JWT_SECRET, { ignoreExpiration: true }, (err, data) => {
    User.refresh(res, data.username, refreshToken, data, (token, err) => {
      if (err)
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid refresh token.'
        });

      res.status(200).json({
        status: 'success',
        data: {
          jwt: token
        }
      });
    });
    // {
    //   role: 'parinte',
    //   username: 'robertfedus5698',
    //   iat: 1596731128,
    //   exp: 1596817528
    // }
  });
};

/* 
  Change normal user password se refera la orice utilizator care doreste sa-si schimbe parola.
  Mai exista si varianta cand operatorul schimba parola unui elev/profesor.
*/
exports.changeNormalUserPassword = (req, res) => {
  const { body } = req;

  return User.changeNormalUserPassword(res, req.username, body.old_password, body.new_password, error => {
    if (error) {
      res.status(401).json({
        status: 'fail',
        message: 'Parolă incorectă.'
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: 'Parolă actualizată cu succes.'
      });
    }
  });
};

/*
  - Change user password from OP se refera la abilitatea unui operator de a schimba parola unui elev/profesor.
  - Operatorul nu are nevoie de parola anterioara a elevului.
  - Functie folositoare atunci cand un elev/profesor isi uita parola.
  - De fapt nu se schimba parola, ci se genereaza una noua de 6 caractere.
*/
exports.changeUserPasswordFromOP = (req, res) => {
  const { body } = req;

  return User.changeUserPasswordFromOP(res, body.user_username, newPassword => {
    res.status(200).json({
      status: 'success',
      message: 'Parola actualizata cu succes.',
      data: {
        password: newPassword
      }
    });
  });
};

exports.checkPasswordResetCode = (req, res) => {
  const { query } = req;

  return User.checkPasswordResetCode(res, query.code, query.email, error => {
    if (error) {
      res.status(404).json({
        status: 'fail',
        message: 'Codul este invalid sau a expirat.'
      });
    } else {
      res.status(200).json({
        staus: 'success',
        data: {
          valid_code: true
        }
      });
    }
  });
};

exports.resetPasswordAfterCodeCheck = (req, res) => {
  const { query, body } = req;

  return User.checkPasswordResetCode(res, query.code, query.email, error => {
    if (error) {
      res.status(404).json({
        status: 'fail',
        message: 'Codul este invalid sau a expirat.'
      });
    } else {
      return User.resetPasswordAfterCodeCheck(res, query.email, body.password, () => {
        res.status(200).json({
          status: 'success',
          message: 'Parola actualizata cu succes.'
        });
      });
    }
  });
};

exports.resetEmailAfterCodeCheck = (req, res) => {
  const { query, body } = req;

  return User.resetEmailAfterCodeCheck(res, body.user_public_id, body.email, error => {
    if (error) {
      res.status(409).json({
        status: 'fail',
        message: 'Există deja un cont cu acest e-mail'
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: 'E-mail actualizat cu succes.'
      });
    }
  });
};

exports.checkEmailResetCode = (req, res) => {
  const { query } = req;

  return User.checkEmailResetCode(res, query.code, query.user_public_id, error => {
    if (error) {
      res.status(404).json({
        status: 'fail',
        message: 'Codul este invalid sau a expirat.'
      });
    } else {
      res.status(200).json({
        staus: 'success',
        data: {
          valid_code: true
        }
      });
    }
  });
};
