const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        product :{
            type : mongoose.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number,
        price: Number
    }],
    cartTotal: Number,
    totalAfterDiscount: Number,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

const Cart = mongoose.model("Cart",cartSchema);
module.exports = Cart;