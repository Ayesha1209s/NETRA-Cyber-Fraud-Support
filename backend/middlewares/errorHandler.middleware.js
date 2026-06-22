// backend/middlewares/errorHandler.middleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // If it's a Zod Validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  // Duplicate key error (e.g. email already exists in MongoDB)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered',
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;