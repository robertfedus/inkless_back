/*
 * Created on Thu Jul 09 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRouter = require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const operatorRouter = require('./routes/operatorRoutes');
const classesRouter = require('./routes/classesRoutes');
const teacherRouter = require('./routes/teacherRoutes');
const sectionRouter = require('./routes/sectionRoutes');
const studentRouter = require('./routes/studentRoutes');
const markRouter = require('./routes/markRoutes');
const absenceRouter = require('./routes/absenceRoutes');
const testRouter = require('./routes/testRoutes');
const messageRouter = require('./routes/messageRoutes');
const timetableRouter = require('./routes/timetableRoutes');
const parentRouter = require('./routes/parentRoutes');
const emailRouter = require('./routes/emailRoutes');
const subjectsRouter = require('./routes/subjectsRoutes');

const morgan = require('morgan');

const app = express();

// Middleware dev only!!
app.use(morgan());
app.use((req, res, next) => {
  console.log(req.body);
  next();
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/subjects', subjectsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/operator', operatorRouter);
app.use('/api/v1/classes', classesRouter);
app.use('/api/v1/teacher', teacherRouter);
app.use('/api/v1/section', sectionRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/mark', markRouter);
app.use('/api/v1/absence', absenceRouter);
app.use('/api/v1/test', testRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/timetable', timetableRouter);
app.use('/api/v1/parent', parentRouter);
app.use('/api/v1/email', emailRouter);

app.use('/api/v1/motd', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'MOTD',
    data: {
      environment: 'production',
      api_version: process.env.API_VERSION,
      license: 'Copyright (c) 2020 Tech Lion',
      available_routes: 26,
      // routes_under_development: ['GET /classes', 'POST /teacher', 'PATCH /teacher'],
      maintenance: 'Under development',
      latest_web_version: '1.0.0',
      latest_ios_version: '1.0.0',
      should_force_update_ios: false, // La force update va veni un array cu versiunile care trebuie sa faca update
      should_force_update_android: false,
      logout_users: false
    }
  });
});

module.exports = app;
