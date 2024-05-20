class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
        this.status = statusCode >= 400 & statusCode < 500 ? false : true;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler;