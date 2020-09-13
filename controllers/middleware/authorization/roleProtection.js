/*
 * Created on Fri Aug 07 2020
 *
 * Copyright (c) 2020 One FPS
 */

const failJson = {
  status: 'fail',
  message: 'Nu ai permisiunea necesara pentru a face asta.'
};

// exports.endMiddlewareChain va fi mereu ultimul in middleware chain!!!

exports.endMiddlewareChain = (req, res, next) => {
  if (req.bypass) return next();
  else {
    if (!req.bypass) return res.status(401).json(failJson);
  }
};

exports.student = (req, res, next) => {
  if (req.bypass) return next();

  if (req.role === 'elev') {
    req.bypass = true;

    return next();
  }

  return next();
};

exports.teacher = (req, res, next) => {
  if (req.bypass) return next();

  if (req.role === 'profesor') {
    req.bypass = true;

    return next();
  }

  return next();
};

exports.parent = (req, res, next) => {
  if (req.bypass) return next();

  if (req.role === 'parinte') {
    req.bypass = true;

    return next();
  }

  return next();
};

exports.operator = (req, res, next) => {
  if (req.bypass) return next();

  if (req.role === 'operator') {
    req.bypass = true;

    return next();
  }

  return next();
};
