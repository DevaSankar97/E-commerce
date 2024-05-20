const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug:{ type: String, required: true, unique: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category:{ type: mongoose.Types.ObjectId, ref:'Category' },
    brand:{ type: mongoose.Types.ObjectId, ref:'Brand' },
    sold: Number,
    images:[],
    ratings:[
        {
            star:  {type:Number,required:true},
            comment: String,
            userId: mongoose.Types.ObjectId,
        }
    ],
    inStock: { type: Boolean, default: false },
    quantity:{ type: Number,required:true},
    color:String,
    totalraing: { type : Number ,default :0} ,
    user:{type:mongoose.Types.ObjectId,ref:"User"}
},{timestamps:true});


// // Method to determine if a product is in stock. Returns a boolean
// productSchema.methods.isInStock = function() {
//     return this.inStock && this.quantity > 0;
// };

// // Static method to get average rating of a product
// productSchema.statics.getAverageRating = async function(id){
//     const product = await this.findById
//     ( id ) ;
//    if(!product) { throw new Error('Product not found')};
//    const total = product.ratings.reduce((total,r)=> total + r.rating,'');
//    return total/product.ratings.length;
// }

let Product = mongoose.model('Product', productSchema)

module.exports = Product