/**
 * User Validators
 * Using express-validator for input validation
 */

const { body, param, query, validationResult } = require('express-validator');
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

// User update validations (for editUser)
const validateUserUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[\wáéíóúüñÁÉÍÓÚÜÑ]+$/).withMessage('Username must be a single word without spaces or special characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email is too long'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('First name is too long'),
  
  body('familyName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Family name is too long'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Invalid role'),
  
  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL'),
  
  handleValidationErrors
];

// ID parameter validation
const validateUserId = [
  param('id')
    .notEmpty().withMessage('User ID is required')
    .matches(/^[0-9a-fA-F]{24}$/).withMessage('Invalid user ID format'),
  
  handleValidationErrors
];

// Query parameter validation for pagination
const validateUserQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// Search query validation
const validateSearchQuery = [
  param('querySearch')
    .trim()
    .notEmpty().withMessage('Search query is required')
    .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters'),
  
  handleValidationErrors
];

module.exports = {
  validateUserUpdate,
  validateUserId,
  validateUserQuery,
  validateSearchQuery
};

