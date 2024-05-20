const Category = require("../models/categoryModel");
const asynErrorHandler = require("../utils/asynErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.createCategory = asynErrorHandler(async (req, res, next) => {
    await Category.create({...req.body, user:req.user._id}).then((category) => {
        res.status(201).json({
            message: "Category created successfully",
            category,
        });
    });
});

exports.getAllCategory = asynErrorHandler(async (req, res, next) => {
    await Category.find().then((category) => {
        res.status(200).json({
            message: "success",
            category,
        });
    });
});

exports.getaCategory = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Category.findOne({_id:id}).then((category) => {
        res.status(200).json({
            message: "success",
            category,
        });
    });
});

exports.updateCategory = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Category.findOneAndUpdate({_id:id}, {...req.body, user:req.user._id}, {
        new: true,
        runValidators: true
    }).then((category) => {
        res.status(200).json({
            message: "success",
            category,
        });
    });
});

exports.deleteCategory = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Category.findById(id).then((category) => {
        if (!category) {
            return next(
                new ErrorHandler(
                    "Category with id " + id + " not found",
                    404
                )
            );
        }
        category.deleteOne().then((category) => {
            res.status(200).json({
                message: "Category Deleted",
                category,
            });
        });
    });
});