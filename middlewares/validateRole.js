/**
 * Role-based Authorization Middleware
 */

const { AuthorizationError } = require('../utils/errors');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
};

const requireAdmin = requireRole('admin');

module.exports = {
  requireRole,
  requireAdmin
};

