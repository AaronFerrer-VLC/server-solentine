/**
 * Brand Validators
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

// Brand creation/update validations
const validateBrand = [
  body('name')
    .trim()
    .notEmpty().withMessage('Brand name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Brand name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description is too long (max 500 characters)'),
  
  handleValidationErrors
];

// ID parameter validation
const validateBrandId = [
  param('id')
    .notEmpty().withMessage('Brand ID is required')
    .matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid brand ID format'),
  
  handleValidationErrors
];

module.exports = {
  validateBrand,
  validateBrandId
};

