/*
 * Created on Thu Jul 09 2020
 *
 * Copyright (c) 2020 One FPS
 */

const app = require('./app');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({ path: './config.env' });
}

process.on('uncaughtException', err => {
  console.log('Uncaught exception. Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
