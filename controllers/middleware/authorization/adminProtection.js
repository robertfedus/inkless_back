/*
 * Created on Sat Aug 22 2020
 *
 * Copyright (c) 2020 Robert Feduș
 */

const adminProtection = (req, res, next) => {
  if (req.query.admin_key !== process.env.ADMIN_KEY)
    return res.status(401).json({
      status: 'fail',
      message: 'Nu ai permisiunea necesara pentru a face asta.'
    });

  return next();
};

module.exports = adminProtection;
