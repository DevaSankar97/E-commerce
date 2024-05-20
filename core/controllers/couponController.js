const Coupon = require("../models/couponModel");
const asynErrorHandler = require("../utils/asynErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.createCoupon = asynErrorHandler(async (req, res, next) => {
    // const { name, email, password, avatar,role } = req.body;
    await Coupon.create({...req.body, user:req.user._id}).then((coupon) => {
        res.status(201).json({
            message: "Coupon created successfully",
            coupon,
        });
    });
});

exports.getAllCoupon = asynErrorHandler(async (req, res, next) => {
    // const { name, email, password, avatar,role } = req.body;
    await Coupon.find().then((coupon) => {
        res.status(200).json({
            message: "success",
            coupon,
        });
    });
});

exports.getaCoupon = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Coupon.findOne({_id:id}).then((coupon) => {
        res.status(200).json({
            message: "success",
            coupon,
        });
    });
});

exports.updateCoupon = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Coupon.findOneAndUpdate({_id:id}, {...req.body, user:req.user._id}, {
        new: true,
        runValidators: true
    }).then((coupon) => {
        res.status(200).json({
            message: "success",
            coupon,
        });
    });
});

exports.deleteCoupon = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Coupon.findById(id).then((coupon) => {
        if (!coupon) {
            return next(
                new ErrorHandler(
                    "Coupon with id " + id + " not found",
                    404
                )
            );
        }
        coupon.deleteOne().then((coupon) => {
            res.status(200).json({
                message: "Coupon Deleted",
                coupon,
            });
        });
    });
});