const User = require("../models/userModel");
const asynErrorHandler = require("../utils/asynErrorHandler");
const sendMail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path:path.join(__dirname,'config/config.env')});
// User Registration and Login
// api - /api/v1/auth/register/
exports.register = asynErrorHandler(async (req, res, next) => {
    const { name, email, password, avatar, role } = req.body;
    await User.create(req.body).then((user) => {
        res.status(201).json({
            message: "User created successfully",
            user,
        });
    });
});
// api - /api/v1/auth/login/
exports.login = asynErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    await User.findOne({ email })
        .select("+password")
        .then((user) => {
            if (!user) {
                return next(new ErrorHandler("User not found", 400));
            }
            if (!user.matchPassword(password)) {
                return next(new ErrorHandler("Invalid Password", 400));
            }
            const token = user.getSignedJwtToken();
            const option = {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            };
            res.cookie("token", token, option).status(200).json({
                message: "User logged in successfully",
                user,
                token,
            });
        });
});
// api - /api/v1/auth/logout/
exports.logout = (req, res, next) => {
    res.clearCookie("token").status(200).json({
        status: true,
        message: "User logged out successfully",
    })
}
exports.isAdmin = async (req, res, next) => {
    // console.log("---",req.user)
    // If the user is authenticated and is an admin then let them pass through.
    // const role = await User.findOne({role:req.user.role}).populate('role');
    // console.log("---",role.role.name)
    await User.findOne(req.user._id).populate('role').then((user) => {
        // console.log(user)
        if (user.role.name !== 'admin') {
            return next(new ErrorHandler(`Role ${user.role.name} is not allowed. Unauthorized`, 403));
        }
    })
    next();
};
exports.isUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.isUser) {
            return res.json({
                user: req.user,
            });
        }
        res.json({
            message: "Not user",
        });
    }
    res.json({
        message: "Not logged in",
    });
};
exports.isAdminOrUser = async (req, res, next) => {
    // console.log("req.user.role",req.user.role)
    await User.findOne(req.user._id).populate('role').then((user) => {
        // console.log(user)
        // console.log(user)
        // if (user.name !== 'admin') {
        //     return next(new ErrorHandler(`Role ${user.name} is not allowed. Unauthorized`, 403));
        // } 
        if (user.role.name === 'admin' || user.role.name === 'user') {
            next();
        } else {
            return next(new ErrorHandler(`Role ${user.role.name} is not allowed. Unauthorized`, 403));
        }
    })
};

// User Profile Management
// api - /api/v1/auth/profile/
exports.getProfile = asynErrorHandler(async (req, res, next) => {
    const id = req.user.id;
    await User.findById(id)
        .select("-password")
        .then((user) => {
            if (!user) {
                return next(new ErrorHandler("User not found", 400));
            }
            res.status(200).json({
                message: "User profile",
                user,
            });
        });
});
// api - /api/v1/auth/profile/
exports.updateProfile = asynErrorHandler(async (req, res, next) => {
    const id = req.user.id;
    // const { email, name, phone } = req.body;
    await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    }).select("-password")
        .then((user) => {
            if (!user) {
                return next(new ErrorHandler("User not found", 400));
            }
            res.status(200).json({
                message: "User profile updated successfully",
                user,
            });
        });
});
// api - /api/v1/auth/role/
exports.updateRole = asynErrorHandler(async (req, res, next) => {
    const id = req.user.id;
    const { role } = req.body;
    await User.findByIdAndUpdate(id, { role }, {
        new: true,
        runValidators: true
    }).select("-password")
        .then((user) => {
            if (!user) {
                return next(new ErrorHandler("User not found", 400));
            }
            res.status(200).json({
                message: "User role updated successfully",
                user,
            });
        });
});
// api - /api/v1/auth/profile/
exports.deleteProfile = asynErrorHandler(async (req, res, next) => {
    const id = req.user.id;
    await User.findByIdAndDelete(id)
        .select("-password")
        .then((user) => {
            if (!user) {
                return next(new ErrorHandler("User not found", 400));
            }
            res.clearCookie("token").status(200).json({
                message: "User profile deleted successfully",
                user,
            });
        });
});
// api - /api/v1/auth/forgot-password/
exports.forgotPassword = asynErrorHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found", 400));
    }
    const token = user.getResetPasswordToken();
    user.save({ validateBeforeSave: false });

    const link = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/auth/reset/${token}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    ${link}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    try {
        sendMail({
            email: user.email,
            message: message
        });
        res.status(200).json({
            status: true,
            message: "Email sent to " + user.email,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.save({ validateBeforeSave: false });
        return next(new ErrorHandler("Error sending email", 500));
    }
});
// api - /api/v1/auth/reset-password/
exports.resetPassword = asynErrorHandler(async (req, res, next) => {
    const token = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has expired.", 400));
    }
    const { password, confirmPassword } = req.body;
    if (password.length < 6) {
        return next(new ErrorHandler("Password must be at least 6 characters long.", 400));
    }
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match.", 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: true,
        message: "Password changed successfully."
    });

});
// api - /api/v1/auth/profile/address/
exports.addAddress = asynErrorHandler(async (req, res, next) => {
    const id = req.user._id; // user's id
    await User.findByIdAndUpdate(id, {
         address: req.body 
    }, { new: true })
        .then((user) => {
            if (!user) {
                return next(new ErrorHandler(`User with the ID ${id} was not found.`, 404))
            } else {
                res.status(200).json({
                    status: true,
                    data: user.address
                });
            }
        });
});

// Admin User Management
// api - /api/v1/auth/admin/users/
exports.getAllUser = asynErrorHandler(async (req, res, next) => {
    await User.find({}).then((users) => {
        res.status(200).json({
            message: "All Users",
            users,
        });
    });
});
// api - /api/v1/auth/user/
exports.getUserById = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await User.findById(id).populate('role').then((user) => {
        if (!user) {
            return next(
                new ErrorHandler(
                    "User with id " + id + " not found",
                    404
                )
            );
        }
        res.status(200).json({
            message: "User Found",
            user,
        });
    });
});
// api - /api/v1/auth/user/
exports.updateUserById = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    console.log(id)
    if(req.file){
        await User.findById(id).then((user) => {
            console.log(req.file)
            if (!user) {
                return next(
                    new ErrorHandler(
                        "User with id " + id + " not found",
                        404
                    )
                );
            }
            console.log(user)
            if(user?.avatar?.filename){
                const filePath = path.join(__dirname, '/uploads/avatar', user.avatar.filename);
                console.log("----",filePath)
                fs.unlink(filePath)
            }
            user.avatar['filename'] = req.file.filename;
            user.avatar['url'] = process.env.BASE_URL+"/avatar/"+req.file.filename
            user.save().then((user) => {
                return res.status(200).json({
                    message: "User Updated",
                    user,
                });
            });
        });
    }
    await User.findByIdAndUpdate(id,req.body, {
        new: true,
        runValidators: true
    }).select("-password")
        .then((user) => {
            if (!user) {
                return next(new ErrorHandler("User with id " + id + " not found", 404));
            }
            return res.status(200).json({
                message: "User Updated",
                user,
            });
        });
  
});
// api - /api/v1/auth/user/
exports.deleteUserById = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await User.findById(id).then((user) => {
        if (!user) {
            return next(
                new ErrorHandler(
                    "User with id " + id + " not found",
                    404
                )
            );
        }
        user.deleteOne().then((user) => {
            res.status(200).json({
                message: "User Deleted",
                user,
            });
        });
    });
});
