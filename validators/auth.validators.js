/**
 * Authentication Validators
 * Using express-validator for input validation
 */

const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');
const { defaultLogger } = require('../utils/logger');

const logger = defaultLogger.child('Validators');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.debug('Validation errors in auth', { errors: errors.array(), path: req.path });
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    return next(new ValidationError('Validation failed', formattedErrors));
  }
  next();
};

// Signup validations
const validateSignup = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email is too long'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[\wáéíóúüñÁÉÍÓÚÜÑ]+$/).withMessage('Username must be a single word without spaces or special characters'),

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

  handleValidationErrors
];

// Login validations
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors
];

module.exports = {
  validateSignup,
  validateLogin
};

