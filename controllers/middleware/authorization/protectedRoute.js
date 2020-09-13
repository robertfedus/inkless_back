/*
 * Created on Mon Jul 13 2020
 *
 * Copyright (c) 2020 One FPS
 */
const jwt = require('jsonwebtoken');

const protectedRoute = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      // console.log(data);

      if (err) {
        if (err.expiredAt)
          return res.status(401).json({
            status: 'fail',
            message: 'Bearer token expired',
            error: 'token_expiration'
          });
      } else {
        req.role = data.role;
        req.username = data.username;
        return next();
      }
    });
  } else {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid bearer token'
    });
  }
};

module.exports = protectedRoute;
