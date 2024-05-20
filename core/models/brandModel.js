const  mongoose = require("mongoose");
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true,unique: true },
    description: String,
    imageUrl:String,
    user:{type : mongoose.Schema.Types.ObjectId , ref:'User'}
}, { timestamps: true });

// Static method to get all categories
brandSchema.statics.getAllBrands = async function () {
    return await this.find();
};

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
