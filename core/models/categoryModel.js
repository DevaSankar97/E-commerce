const  mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true },
    user:{type : mongoose.Schema.Types.ObjectId , ref:'User'}
}, { timestamps: true });

// Static method to get all categories
categorySchema.statics.getAllCategories = async function () {
    return await this.find();
};
const Category = mongoose.model("Category", categorySchema);
module.exports = Category
