const validationError = require('./../../../utils/validationError');

exports.addMark = (req, res, next) => {
  // DIN QUERY: semester, thesis
  // DIN BODY: student_public_id, teacher_public_id, subject_public_id, value, message, date (optional)
  // UNDE student_public_id si teacher_public_id se refera la user public id!!!
  const { query } = req;
  const { body } = req;

  if (!query.thesis || !body.student_public_id || !body.teacher_public_id || body.value === undefined)
    return validationError(res, 400, 'Request eronat.');

  if (!(body.value > 0 && body.value < 11))
    return validationError(res, 400, '"value" poate lua valori numai intre 1 si 10.');

  if (body.message && body.message.length > 150)
    return validationError(res, 400, '"message" poate avea maxim 150 de caractere.');

  return next();
};

exports.updateMark = (req, res, next) => {
  const { query, body } = req;
  if (!body.value) return validationError(res, 400, 'Request eronat.');

  if (!query.mark_public_id || !query.field) return validationError(res, 400, 'Request eronat.');

  if (query.field === 'value') {
    if (!(body.value > 0 && body.value < 11))
      return validationError(res, 400, '"value" poate lua valori numai intre 1 si 10.');
  }

  return next();
};
