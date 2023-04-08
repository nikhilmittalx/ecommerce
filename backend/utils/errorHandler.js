class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;

        // this will show the location of the error
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler