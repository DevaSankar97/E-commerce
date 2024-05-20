const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type:String, required: true},
    type: {
        type:String,
        required:true,
        enum:["residential","business","others"]
    },
    user:{type: mongoose.Types.ObjectId,ref:"User"}
},{timestamps:true});


const Address = mongoose.model("Address", addressSchema)
module.exports = Address
