/*
 * Created on Thu Jul 09 2020
 *
 * Copyright (c) 2020 One FPS
 */

const express = require('express');
const authController = require('./../controllers/authController');
const authValidation = require('./../controllers/middleware/validation/authValidation');
const protectedRoute = require('./../controllers/middleware/authorization/protectedRoute');
const roleProtection = require('./../controllers/middleware/authorization/roleProtection');

const router = express.Router();

// prettier-ignore
router.post('/register', authValidation.register, authController.register);
router.post('/login', authController.login);
router.get('/refresh', authController.refresh);

/*
  Change normal user password se refera la orice utilizator care doreste sa-si schimbe parola.
  Mai exista si varianta cand operatorul schimba parola unui elev/profesor.
*/
router.post(
  '/password/user',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.student,
  roleProtection.parent,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  authController.changeNormalUserPassword
);

/*
  - Change user password from OP se refera la abilitatea unui operator de a schimba parola unui elev/profesor.
  - Operatorul nu are nevoie de parola anterioara a elevului.
  - Functie folositoare atunci cand un elev/profesor isi uita parola.
  - De fapt nu se schimba parola, ci se genereaza una noua de 6 caractere.
*/
router.post(
  '/password/operator/user',
  protectedRoute,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  authController.changeUserPasswordFromOP
);

router.get('/password/reset', authController.checkPasswordResetCode);
router.post('/password/reset', authController.resetPasswordAfterCodeCheck);
router.get(
  '/email/reset',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.student,
  roleProtection.parent,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  authController.checkEmailResetCode
);
router.post(
  '/email/reset',
  protectedRoute,
  roleProtection.teacher,
  roleProtection.student,
  roleProtection.parent,
  roleProtection.operator,
  roleProtection.endMiddlewareChain,
  authController.resetEmailAfterCodeCheck
);

module.exports = router;
