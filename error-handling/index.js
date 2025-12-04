const { NotFoundError } = require('../utils/errors');
const errorHandler = require('../middlewares/errorHandler');

module.exports = (app) => {
  // Handle 404 routes
  app.use((req, res, next) => {
    next(new NotFoundError('Route'));
  });

  // Centralized error handling
  app.use(errorHandler);
}
