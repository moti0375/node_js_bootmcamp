class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    console.log('Error constructor');
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); //This will prevent from the error object to apear in the stack
  }
}

module.exports = AppError;
