const AppError = require('../utils/appError');

const handleCastErrorDB = error => {
  console.log('handleCastErrorDB: was called');
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = error => {
  // console.log(`handleValidationErrorDB was called: ${error.errors.length} errors ${JSON.stringify(error.errors)}`);
  const errors = Object.values(error.errors)
    .map(e => e.message)
    .join('. ');

  const errorMessage = `Invlid input: ${errors}`;
  console.log(errorMessage);
  return new AppError(errorMessage, 400);
};

const handleDuplicateErrorDB = error => {
  console.log('handleDuplicateErrorDB was called');
  return new AppError(`Cannot have duplicate of ${error.keyValue.name} `, 400);
};

const handleJwtError = () => {
  console.log('handleJwtError: was called');
  return new AppError(`Invalid token please login again`, 401);
};

const handleJwtExpired = () => new AppError(`Token expired, please login again`, 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  //RENDERD WEB SITE
  console.log(`Rendring error page...: ${JSON.stringify(err)}`);
  return res.status(err.statusCode).render('error', {
    title: `Something went wrong`,
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  console.log(`sendErrorProd: ${err.message}`);
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    console.error('💥 ERROR:', err);
    return res.status(500).json({
      status: err.status,
      message: 'Something went very wrong'
    });
  }
  //For rendered web site
  return res.status(err.statusCode).render('error', {
    title: `Something went wrong`,
    msg: 'Please try again later'
  });
};

module.exports = (err, req, res, next) => {
  console.error(err.message);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJwtError(error);
    } else if (error.name === 'TokenExpiredError') {
      error = handleJwtExpired(error);
    }

    sendErrorProd(error, req, res);
  }
};
