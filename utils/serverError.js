/*
 * Created on Thu Jul 09 2020
 *
 * Copyright (c) 2020 One FPS
 */

const serverError = (res, err) => {
  console.log(err);
  return res.status(500).json({
    status: 'fail',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err
  });
};

module.exports = serverError;
