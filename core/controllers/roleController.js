const { isAuthenticateUser } = require("../middlewares/authenticate");
const Role = require("../models/roleModel");
const asynErrorHandler = require("../utils/asynErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.createRole = asynErrorHandler(async (req, res, next) => {
    await Role.create({...req.body, user:req.user._id}).then((role) => {
        res.status(201).json({
            message: "Role created successfully",
            role,
        });
    });
});

exports.getAllRole = asynErrorHandler(async (req, res, next) => {
    await Role.find().then((role) => {
        res.status(200).json({
            message: "success",
            role,
        });
    });
});

exports.getaRole = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Role.findOne({_id:id}).then((role) => {
        res.status(200).json({
            message: "success",
            role,
        });
    });
});

exports.updateRole = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Role.findOneAndUpdate({_id:id}, {...req.body, user:req.user._id}, {
        new: true,
        runValidators: true
    }).then((role) => {
        res.status(200).json({
            message: "success",
            role,
        });
    });
});

exports.deleteRole = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Role.findById(id).then((role) => {
        if (!role) {
            return next(
                new ErrorHandler(
                    "Role with id " + id + " not found",
                    404
                )
            );
        }
        role.deleteOne().then((role) => {
            res.status(200).json({
                message: "Role Deleted",
                role,
            });
        });
    });
});
