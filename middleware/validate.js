const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ status:'error', errors: errors.array() });
    }
    next();
};

module.exports = validate;
