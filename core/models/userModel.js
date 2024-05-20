const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Name']
    },
    email: {
        type: String,
        required: [true, 'Please Enter Email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please Enter Valid Email'],
    },
    mobile:{
        type: String, 
        required : [true,"Mobile number is required"],
        unique : [true,"This Mobile Number already in use"]    
    },
    password: {
        type: String,
        required: [true, 'Please Enter Password'],
        minlength: [6, 'Password Must be 6 Characters At Least'],
        select: false,
    },
    avatar: {
        type: Object,
        // // default:'https://i.ibb.co/V6yJy0s/default-avatar.png',
        // required: true
        // type: Buffer,
        required: false
    },
    role: {
        type:mongoose.Types.ObjectId, ref:"Role"
    },
    isActive:{
        type:Boolean,
        default:false
    },
    cart:[{
        productId: {type:mongoose.Types.ObjectId, ref:"Product"} ,
        quantity:Number
    }],
    address:{
        buildingName:String,
        street:String,
        area:String,
        city:String,
        state:String,
        country:String,
        pincode:String
    },
    wishlist:[{
        type: mongoose.Types.ObjectId, ref:"Product"
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

})

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    }
    next()
})

userSchema.methods.matchPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex')
    // this.resetPasswordToken = crypto
    //     .createHash('sha256')
    //     .update(resetToken)
    //     .digest('hex')
    this.resetPasswordExpire = Date.now() + 3600000 
    return resetToken
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.resetPasswordToken
    delete userObject.resetPasswordExpire
    return userObject
}

const User = mongoose.model("User", userSchema)
module.exports = User
