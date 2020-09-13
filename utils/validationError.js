/*
 * Created on Thu Jul 09 2020
 *
 * Copyright (c) 2020 One FPS
 */

module.exports = (res, code, message) => {
  return res.status(code).json({
    status: 'fail',
    message
  });
};
