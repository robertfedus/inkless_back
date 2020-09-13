/*
 * Created on Fri Aug 14 2020
 *
 * Copyright (c) 2020 One FPS
 */
const nodemailer = require('nodemailer');
const User = require('./../models/userModel');

const transporter = nodemailer.createTransport({
  host: 'mail.inkless.ro',
  service: 'mail.inkless.ro',
  secure: true,
  port: 465,
  starttls: {
    enable: true
  },
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.orderSubscription = (req, res) => {
  const text = `
    Tip abonament: ${req.body.subscription_type.toLowerCase()}
    Județ: ${req.body.county}
    Numele școlii: ${req.body.school}
    E-mail: ${req.body.email}
    Telefon: ${req.body.phone}
  `;

  let helperOptions = {
    from: `"Inkless" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'Comandă nouă de abonament Inkless',
    text
  };

  transporter.sendMail(helperOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Email has been sent.'
    });

    // console.log(info);
  });
};

exports.requestPasswordReset = (req, res) => {
  return User.requestPasswordReset(res, req.body.email, code => {
    const text = `
    Ați solicitat resetarea parolei contului Inkless corespunzător adresei ${req.body.email} de e-mail.
    Vă rugăm să introduceți următorul cod în aplicația noastră pentru a continua procesul de resetare a parolei.

    Codul valabil pentru numai 5 minute:
    ${code}

    Dacă nu ați solicitat resetarea sau nu dețineți un cont pe inkless.ro, vă rugăm sa ignorați acest e-mail.

    Cu stimă,
    Administrator Inkless
  `;

    let helperOptions = {
      from: `"Inkless" <${process.env.ADMIN_EMAIL}>`,
      to: req.body.email,
      subject: 'Resetarea parolei Inkless',
      text
    };

    transporter.sendMail(helperOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          status: 'fail',
          message: 'Internal server error.'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Cererea a fost efectuata.'
      });

      // console.log(info);
    });
  });
};

exports.requestEmailReset = (req, res) => {
  return User.requestEmailReset(res, req.body.user_public_id, code => {
    const text = `
    Ați solicitat schimbarea/adăugarea email-ului contului Inkless.
    Vă rugăm să introduceți următorul cod în aplicația noastră pentru a continua procesul de resetare a parolei.

    Codul valabil pentru numai 5 minute:
    ${code}

    Dacă nu ați solicitat schimbarea sau nu dețineți un cont pe inkless.ro, vă rugăm sa ignorați acest e-mail.

    Cu stimă,
    Administrator Inkless
  `;

    let helperOptions = {
      from: `"Inkless" <${process.env.ADMIN_EMAIL}>`,
      to: req.body.email,
      subject: 'Schimbarea/adăugarea e-mail-ului Inkless',
      text
    };

    transporter.sendMail(helperOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          status: 'fail',
          message: 'Internal server error.'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Cererea a fost efectuata.'
      });

      // console.log(info);
    });
  });
};
