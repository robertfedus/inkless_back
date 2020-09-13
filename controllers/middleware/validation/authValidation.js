/*
 * Created on Thu Jul 09 2020
 *
 * Copyright (c) 2020 One FPS
 */

const validationError = require('./../../../utils/validationError');
const User = require('./../../../models/userModel');

exports.register = async (req, res, next) => {
  const body = req.body;
  const roles = ['elev', 'profesor', 'parinte'];

  if (!roles.includes(req.query.role)) return validationError(res, 400, 'Request eronat.');

  // prettier-ignore
  if (!body.first_name || !body.last_name || !req.query.role)
    return validationError(res, 400, 'Request eronat.');

  if ((req.query.role === 'elev' || req.query.role === 'profesor') && !body.school)
    return validationError(res, 400, 'Request eronat.');

  if (req.query.role === 'elev') {
    if (!body.class_public_id) return validationError(res, 400, 'Request eronat.');
  }

  if (req.query.role === 'parinte') {
    // prettier-ignore
    if (body.password.length < 6)
      return validationError(res, 400, 'Parola trebuie sa contina minim 6 caractere.');

    if (!body.username || !body.password || !body.email) return validationError(res, 400, 'Request eronat.');

    const usernameExists = await User.checkUsernameRepetition(body.username);
    if (usernameExists) return validationError(res, 409, 'Username-ul exista deja.');

    const emailExists = await User.checkEmailRepetition(body.email);
    if (emailExists) return validationError(res, 409, 'Email-ul exista deja');
  }

  return next();
};
