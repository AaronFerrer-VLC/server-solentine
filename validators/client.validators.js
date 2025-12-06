/**
 * Client Validators
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

// Client creation/update validations
const validateClient = [
  body('name')
    .trim()
    .notEmpty().withMessage('Client name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Client name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email is too long'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 500 }).withMessage('Address must be between 5 and 500 characters'),
  
  body('position.lat')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  
  body('position.lng')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  
  // If position is provided, both lat and lng must be present
  body('position').custom((value) => {
    if (value && (value.lat === undefined || value.lng === undefined)) {
      throw new Error('Both latitude and longitude must be provided if position is specified');
    }
    return true;
  }),
  
  handleValidationErrors
];

// ID parameter validation
const validateClientId = [
  param('id')
    .notEmpty().withMessage('Client ID is required')
    .matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid client ID format'),
  
  handleValidationErrors
];

// Name parameter validation
const validateClientName = [
  param('name')
    .trim()
    .notEmpty().withMessage('Client name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Client name must be between 2 and 100 characters'),
  
  handleValidationErrors
];

module.exports = {
  validateClient,
  validateClientId,
  validateClientName
};

