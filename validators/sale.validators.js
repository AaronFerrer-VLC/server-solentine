/**
 * Sale Validators
 * Using express-validator for input validation
 */

const { body, validationResult, query } = require('express-validator');
const { ValidationError } = require('../utils/errors');
const mongoose = require('mongoose');

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

// Sale creation/update validations
const validateSale = [
  // Legacy fields (Spanish) - for backward compatibility
  body('Id')
    .optional()
    .isInt({ min: 1 }).withMessage('Sale ID must be a positive integer'),
  
  body('Día')
    .optional()
    .isInt({ min: 1, max: 31 }).withMessage('Day must be between 1 and 31'),
  
  body('Mes')
    .optional()
    .isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  
  body('Año')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be between 2000 and 2100'),
  
  body('Fecha')
    .optional()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/).withMessage('Date must be in DD/MM/YYYY format'),
  
  body('Negocio')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Business name must be between 1 and 100 characters'),
  
  body('Zona')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return mongoose.Types.ObjectId.isValid(value);
    }).withMessage('Zone must be a valid ObjectId'),
  
  body('Marca')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return mongoose.Types.ObjectId.isValid(value);
    }).withMessage('Brand must be a valid ObjectId'),
  
  body('Cliente')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return mongoose.Types.ObjectId.isValid(value);
    }).withMessage('Client must be a valid ObjectId'),
  
  body('Importe')
    .optional()
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  
  body('Comercial')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return mongoose.Types.ObjectId.isValid(value);
    }).withMessage('Commercial must be a valid ObjectId'),
  
  // Normalized fields (English) - preferred
  body('saleId')
    .optional()
    .isInt({ min: 1 }).withMessage('Sale ID must be a positive integer'),
  
  body('day')
    .optional()
    .isInt({ min: 1, max: 31 }).withMessage('Day must be between 1 and 31'),
  
  body('month')
    .optional()
    .isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  
  body('year')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be between 2000 and 2100'),
  
  body('date')
    .optional()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/).withMessage('Date must be in DD/MM/YYYY format'),
  
  body('business')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Business name must be between 1 and 100 characters'),
  
  body('zone')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return mongoose.Types.ObjectId.isValid(value);
    }).withMessage('Zone must be a valid ObjectId'),
  
  body('brand')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return mongoose.Types.ObjectId.isValid(value);
    }).withMessage('Brand must be a valid ObjectId'),
  
  body('client')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return mongoose.Types.ObjectId.isValid(value);
    }).withMessage('Client must be a valid ObjectId'),
  
  body('amount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  
  body('commercial')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return mongoose.Types.ObjectId.isValid(value);
    }).withMessage('Commercial must be a valid ObjectId'),
  
  // At least one date field must be provided
  body().custom((value) => {
    const hasDate = value.Fecha || value.date || (value.Día && value.Mes && value.Año) || (value.day && value.month && value.year);
    if (!hasDate) {
      throw new Error('At least one date field (date, Fecha, or day/month/year) must be provided');
    }
    return true;
  }),
  
  // At least one amount field must be provided
  body().custom((value) => {
    const hasAmount = value.Importe || value.amount;
    if (!hasAmount) {
      throw new Error('Amount (Importe or amount) is required');
    }
    return true;
  }),
  
  handleValidationErrors
];

// Query validations for filtering
const validateSaleQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  
  query('sortKey')
    .optional()
    .isIn(['Fecha', 'date', 'Importe', 'amount', 'Año', 'year', 'Negocio', 'business'])
    .withMessage('Invalid sort key'),
  
  query('sortDirection')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Sort direction must be asc or desc'),
  
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be between 2000 and 2100'),
  
  query('business')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Business name is too long'),
  
  handleValidationErrors
];

module.exports = {
  validateSale,
  validateSaleQuery
};

