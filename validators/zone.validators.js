/**
 * Zone Validators
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

// Zone creation/update validations
const validateZone = [
  body('name')
    .trim()
    .notEmpty().withMessage('Zone name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Zone name must be between 2 and 100 characters'),
  
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
const validateZoneId = [
  param('id')
    .notEmpty().withMessage('Zone ID is required')
    .matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid zone ID format'),
  
  handleValidationErrors
];

module.exports = {
  validateZone,
  validateZoneId
};

