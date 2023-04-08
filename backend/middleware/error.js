const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";


    // wrong mongo db id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400)
    }
    
    // mongoose duplicate key error(same id se new account agr bnane ki koshish kre)
    if(err.code===11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered `
        err = new ErrorHandler(message, 400)
    }
    
    // wrong jwt error
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid, Try again`;
        err = new ErrorHandler(message, 400)
    }
    
    // jwt expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json web token is expired, Try again`;
        err = new ErrorHandler(message, 400)
    }
    
    res.status(err.statusCode).json({
        success:false,
        error: err.message,
        // error:err.stack, 
        //```err.stack``` se poori stack aa jaegi ki kaha pe error h, kya error h
    })
}