const { v4 } = require('uuid')
const Product = require("../models/productModel");
const asynErrorHandler = require("../utils/asynErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const { default: mongoose } = require('mongoose');

exports.createProduct = asynErrorHandler(async (req, res, next) => {
    await Product.create({ ...req.body, user: req.user._id }).then((product) => {
        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    });
});

exports.getAllProduct = asynErrorHandler(async (req, res, next) => {
    const message = req.query.search ? 'Search data' : 'All the products';
    const resPerPage = 2;
    let query = Product.find();
    const queryStr = req.query;
    let keyword = queryStr.search ? {
        name: {
            $regex: queryStr.search,
            $options: 'i'
        }
    } : {};
    query.find({ ...keyword });

    const queryStrCopy = { ...queryStr };
    const removeFields = ['search', 'page', 'limit'];
    removeFields.forEach(remove => delete queryStrCopy[remove]);
    let querys = JSON.stringify(queryStrCopy);
    querys = querys.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)
    query.find(JSON.parse(querys));

    // Sorting
    if (queryStr.sort) {
        const sortBy = queryStr.sort.split(',').join(' ');
        query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    };
    let category = queryStr.category ? {
        "category": { $in: queryStr.category.split(",") }
    } : {};
    query.find({ ...category })
    // Executing the Query with pagination
    if (req.query.page && req.query.limit) {
        const currentPage = Number(queryStr.page) || 1;
        const skip = resPerPage * currentPage - 1;
        query.limit(resPerPage).skip(skip);
    }
    const data = await query;
    res.status(200).json({
        status: true,
        count: data.length,
        message: message,
        data
    });
});

exports.getaProduct = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Product.findOne({ _id: id }).then((product) => {
        res.status(200).json({
            message: "success",
            product,
        });
    });
});

exports.updateProduct = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Product.findOneAndUpdate({ _id: id }, { ...req.body, user: req.user._id }, {
        new: true,
        runValidators: true
    }).then((product) => {
        res.status(200).json({
            message: "success",
            product,
        });
    });
});

exports.deleteProduct = asynErrorHandler(async (req, res, next) => {
    const id = req.params.id;
    await Product.findById(id).then((product) => {
        if (!product) {
            return next(
                new ErrorHandler(
                    "Product with id " + id + " not found",
                    404
                )
            );
        }
        product.deleteOne().then((product) => {
            res.status(200).json({
                message: "Product Deleted",
                product,
            });
        });
    });
});

exports.rating = asynErrorHandler(async (req, res, next) => {
    const { star, productId, comment } = req.body;
    const userId = req.user._id;
    //checking if the user has already rated this product or not
    const product = await Product.findById(productId);
    let existRating = product.ratings.find((rating) => rating.userId.toString() === userId.toString());
    if (existRating) {
        await Product.updateOne({ ratings: { $elemMatch: existRating }, },
            { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
            { new: true }
        )
    } else {
        await Product.findByIdAndUpdate(
            productId,
            {
                $push: {
                    ratings:
                    {
                        star: star,
                        comment: comment,
                        userId: userId
                    }
                }
            },
            { new: true }
        )
    }
    const getAllRatings = await Product.findById(productId);
    const totalRating = getAllRatings.ratings.length;
    const sumOfRating = getAllRatings.ratings.reduce((a, b) => a + b.star, 0);
    const actualRating = Math.round(sumOfRating / totalRating);
    const finalproduct = await Product.findByIdAndUpdate(
        productId, {
        totalraing: actualRating,
    }, { new: true });
    res.status(200).json({
        status: true,
        message: "Rated successfully",
        finalproduct
    });
})

exports.wishList = asynErrorHandler(async (req, res, next) => {
    // console.log("Wishlist req.body :>> ", req.body);
    const { productId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    let existWishList = user.wishlist.find((wish) => wish.userId.toString() === userId.toString());
    if (existWishList) {
        const user = await User.findByIdAndUpdate(
            userId, {
            $pull: {
                wishlist: productId
            }
        }, { new: true }
        );
        return res.status(200).json({
            status: true,
            user
        })
    } else {
        const user = await User.findByIdAndUpdate(
            userId, {
            $push: {
                wishlist: productId
            }
        }, { new: true }
        );
        return res.status(200).json({
            status: true,
            user
        })
    }
});

exports.cart = asynErrorHandler(async (req, res, next) => {
    const { cart } = req.body;
    const userId = req.user._id;
    let products = [];
    const user = await User.findById(userId);
    const existCart = await Cart.findOne({ user: user.id });
    if (existCart) {
        existCart.deleteOne();
    }
    for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i].productId;
        object.quantity = cart[i].quantity;
        let getPrice = await Product.findById(cart[i].productId).select('price').exec();
        object.price = getPrice.price;
        products.push(object);
    }
    console.log(products)
    var cartTotal = 0;
    for (let j = 0; j < products.length; j++) {
        cartTotal = (cartTotal + products[j].price * products[j].quantity).toFixed(2);
    }
    let newCart = await Cart.create({
        products,
        cartTotal,
        user: userId
    })
    newCart.save();
    res.status(200).json({
        status: true,
        newCart
    })
})

exports.getCart = asynErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    res.status(200).json({
        status: true,
        cart
    })
})

exports.deleteCart = asynErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await Cart.find({ user: userId }).deleteMany();
    res.status(200).json({
        status: true,
        cart
    })
})

exports.applyCoupon = asynErrorHandler(async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user._id;
    const validCoupon = await Coupon.findOne({ name: name });
    if (validCoupon === null) {
        return next(
            new ErrorHandler(
                name + " not valid coupon",
                404
            )
        );
    }
    const user = await User.findOne({ _id: userId });
    let { cartTotal } = await Cart.findOne({ user: user._id });
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
    await Cart.findOneAndUpdate({ user: userId }, { totalAfterDiscount }, { new: true });
    res.status(200).json({
        status: true,
        totalAfterDiscount
    })
})

exports.order = asynErrorHandler(async (req, res, next) => {
    let { method, couponapplied, taxPrice, shippingPrice } = req.body;
    const userId = req.user._id;
    // get the order from the db and calculate the total after discount
    let cartTotal, totalAfterDiscount, totalPrice, products;

    const user = await User.findById(userId);
    const cart = await Cart.findOne({ user: user.id });
    console.log(cart)
    if(cart !== null){
        cart.products.forEach((product) => {
            products = products ? [...products, product] : [product];
        });
        ({ cartTotal, totalAfterDiscount } = cart);
        if (couponapplied) {
            taxPrice = taxPrice || 0;
            shippingPrice = shippingPrice || 0;
            totalPrice = (parseFloat(totalAfterDiscount) + parseFloat(taxPrice) + parseFloat(shippingPrice)).toFixed(2);
        } else {
            totalPrice = cartTotal.toFixed(2);
        }
        let order = await Order.create({
            products,
            priceInfo: {
                taxPrice,
                shippingPrice,
                totalPrice
            },
            paymentInfo: {
                methodOfPayment: method === 'cod' ? 'cod' : 'Online',
                paidAt: method === 'cod' ? null : new Date(),
                isPaid: method === 'cod' ? false : true,
                transaction_id: v4()
            },
            status: "Pending",
            deliveryAddress: user.address,
            contact: user.mobile,
            user: user._id
        });
        await order.save();
        await Cart.findOneAndDelete({ user: userId });
        // send email to customer with order details
        // try {
        //     const transporter = nodemailer.createTransport({
        //         service: 'gmail',
        //         auth: {
        //             user: process.env.EMAIL_USER,
        //             pass: process.env.EMAIL_PASSWORD
        //         }
        //     });
        //     const mailOptions = {
        //         from: `"Foodie" <${process.env.EMAIL_USER}>`,
        //         to: `${req.user.email}`,
        //         subject: `Your order has been placed successfully!`,
        //         text: `Hello ${req.user.name}, your order is being processed. Please check your order history for more information.`,
        //         text: `Hello ${req.user.name}, your order is being processed. Please wait for our representative to contact you regarding your order`,
        //         text: `Hello ${req.user.name}, your order number is ${order._id}. Please check your profile for more information.`,
        //         text: `Hello ${req.user.name}, your order number is ${order._id}. Please check your orders in our website or.`,
        //     }
        //     // text version of email body
        //     let html = `<h3>Hello ${req.user.name}, your order has been received.</h3>` +
        //         `<p>Transaction ID: ${order._id}</p>` +
        //         `<a href="${process.env.CLIENT_URL}/orders/${order._id}" target="_blank">View Your Order</a><br/>` +
        //         `<a href="${process.env.CLIENT_URL}/orders/${order._id}" target="_blank">View Your Order</a><br/>` +
        //         `<a href="${process.env.CLIENT_URL}/orders/${order._id}" target="_blank">View Your Order</a><br/>` +
        //         `<a href="${process.env.CLIENT_URL}/orders/${order._id}" target="_blank">View Your Order</a><br/>` 
        //     `<a href="${process.env.CLIENT_URL}/orders/${order._id}" target="_blank">View Your Order</a><br/>` +
        //     `<b>Payment Method: </b>${COD ? "Cash on Delivery" : "Online Payment"}<br/>`;
        //     if (!COD && couponapplied) {
        //         html += `<b>Promo Code Used: </b>${couponapplied}<br/>`
        //     }
        //     mailOptions.html = html;
        //     await transporter.sendMail(mailOptions);
        // } catch (err) {
        //     console.log('Email Error: ', err);
        // };
        // // save the transaction id in session for use later
        // req.session.transactionId = order._id;
        return res.status(201).json({
            status: true,
            message: 'Order placed successfully',
            data: {
                order
            }
        })
    }else{
        return res.status(404).json({
            status: false,
            message: 'Cart empty. Please add some products.'
        })
    }
});



exports.getMyOrders = asynErrorHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id }).sort({ date: -1 });
    return res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
            orders
        }
    });
});



exports.getOrderById = asynErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user");

    // check if the order exists
    if (!order) {
        return next(new CustomError("Order not found.", 404));
    }

    // make sure the user is the owner of this order
    if (order.user != req.user.id) {
        return next(new CustomError("You are not authorized to perform this action on this order.", 401))
    }

    res.status(200).json({
        status: "success",
        data: {
            order
        }
    });
})


exports.createOrder = asynErrorHandler(async (req, res, next) => {
    // add user to the request body
    req.body.user = req.user.id;

    // create a new order with the request body
    const order = await Order.create(req.body);

    // send response
    res.status(201).json({
        status: "success",
        data: {
            order
        }
    })
});


exports.updateOrderToPaid = asynErrorHandler(async (req, res, next) => {
    let order = await Order.findById(req.params.id);

    // check if the order exists
    if (!order) {
        return next(new CustomError('The order does not exist', 404));
    }

    // make sure the order belongs to the user making the request
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new CustomError("You don't have permission to perform this action on this order", 401))
    }

    // update the order to paid
    order = await Order.paymentProcess(order, req.body);

    res.status(200).json({
        status: "success",
        data: {
            order
        }
    });
});


exports.getAllOrders = asynErrorHandler(async (req, res, next) => {
    const pageSize = +req.query.pagesize || 8;
    const currentPage = +req.query.page || 1;
    const showAll = req.query.show === 'all';

    // find and count all orders
    const count = await Order.countDocuments();

    const orders = await Order.find()
        .populate({
            path: 'user',
            select: 'name id image'
        })
        .sort({ date: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(showAll ? count : pageSize)

    // pagination result
    const paginationResult = {
        current: currentPage,
        pages: showAll ? 1 : Math.ceil(count / pageSize),
        total: count,
    };

    res.status(200).json({
        status: "success",
        data: {
            orders,
            pagination: paginationResult
        }
    });
});



// exports.getMyOrders = asynErrorHandler(async (req, res, next) => {

//     res.status(200).json({
//         status: 'success',
//         data: {
//             totalPages: result.pages,
//             currentPage: page,
//             perPage: limit,
//             results: docs
//         }
//     })
// });


