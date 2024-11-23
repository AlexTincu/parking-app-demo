const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {      
        return res.status(403).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array().map(error => ({
              field: error.path,
              message: error.msg,
            })),
          });
    }
    next();
};

module.exports = validate;
