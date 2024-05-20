const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user:{type : mongoose.Schema.Types.ObjectId , ref:'User'}
}, { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema)
module.exports = Role