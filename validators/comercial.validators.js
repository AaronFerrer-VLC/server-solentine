/**
 * Comercial Validators
 * Using express-validator for input validation
 */

const { body, param, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    return next(new ValidationError('Validation failed', formattedErrors));
  }
  next();
};

// Comercial creation/update validations
const validateComercial = [
  body('name')
    .trim()
    .notEmpty().withMessage('Comercial name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Comercial name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email is too long'),
  
  handleValidationErrors
];

// ID parameter validation
const validateComercialId = [
  param('id')
    .notEmpty().withMessage('Comercial ID is required')
    .matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid comercial ID format'),
  
  handleValidationErrors
];

module.exports = {
  validateComercial,
  validateComercialId
};

