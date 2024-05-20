const Brand = require("../models/brandModel");
const asynErrorHandler = require("../utils/asynErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.createBrand = asynErrorHandler(async (req, res, next) => {
    // const { name, email, password, avatar,role } = req.body;
    await Brand.create({...req.body, user:req.user._id}).then((brand) => {
        res.status(201).json({
            message: "Brand created successfully",
            brand,
        });
    });
});

exports.getAllBrand = asynErrorHandler(async (req, res, next) => {
    // const { name, email, password, avatar,role } = req.body;
    await Brand.find().then((brand) => {
        res.status(200).json({
            message: "success",
            brand,
        });
    });
});

exports.getaBrand = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Brand.findOne({_id:id}).then((brand) => {
        res.status(200).json({
            message: "success",
            brand,
        });
    });
});

exports.updateBrand = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Brand.findOneAndUpdate({_id:id}, {...req.body, user:req.user._id}, {
        new: true,
        runValidators: true
    }).then((brand) => {
        res.status(200).json({
            message: "success",
            brand,
        });
    });
});

exports.deleteBrand = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Brand.findById(id).then((brand) => {
        if (!brand) {
            return next(
                new ErrorHandler(
                    "Brand with id " + id + " not found",
                    404
                )
            );
        }
        brand.deleteOne().then((brand) => {
            res.status(200).json({
                message: "Brand Deleted",
                brand,
            });
        });
    });
});