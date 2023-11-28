const { body, validationResult } = require('express-validator');

const validateUser = [
  body("firstname").isLength({ max: 255 }).isString(),
  body("lastname").isLength({ max: 255 }).isString(),
  body("email").isEmail(),
  body("city").isLength({ max: 255 }).isString(),
  body("language").isLength({ max: 255 }).isString(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = validateUser;
