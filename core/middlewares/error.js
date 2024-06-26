const devError = (res,err)=>{
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const prodError = (res,err)=>{
    let message = err.message;
    let error = new Error(message);
    

    if(err.name == "ValidationError") {
        message = Object.values(err.errors).map(value => value.message)
        error = new Error(message)
        err.statusCode = 400
    }

    if(err.name == 'CastError'){
        message = `Resource not found: ${err.path}` ;
        error = new Error(message)
        err.statusCode = 400
    }

    if(err.code == 11000) {
        let message = `Duplicate ${Object.keys(err.keyValue)} error`;
        error = new Error(message)
        err.statusCode = 400
    }

    if(err.name == 'JSONWebTokenError') {
        let message = `JSON Web Token is invalid. Try again`;
        error = new Error(message)
        err.statusCode = 400
    }

    if(err.name == 'TokenExpiredError') {
        let message = `JSON Web Token is expired. Try again`;
        error = new Error(message)
        err.statusCode = 400
    }

    res.status(err.statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
}

module.exports = (err, req, res, next) =>{
    err.statusCode  = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        devError(res,err);
    }else{
        prodError(res,err);
    }
}