const jwt = require("jsonwebtoken");
const asynErrorHandler = require("../utils/asynErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

exports.isAuthenticateUser = asynErrorHandler(async (req, res, next) => {
  //  console.log(req.headers.cookie);
  // const token  = req.headers.cookie.split('=')[1];
  const { token } = req.cookies
  // console.log("token",token)

    if(!token){
        return next(new ErrorHandler('Login first to handle the resource'));
    }
    // if(!req.user){
    //   return next(new ErrorHandler('User not found',400));
    // }
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decode._id)
    next();
});
