const mongoose = require('mongoose')
const reviewSchema = new mongoose.Schema({
   user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
   },
   product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true
   },
   rating: {
      type: Number,
      required: true
   },
   comment: String,
   createdAt: {
      type: Date,
      default: Date.now
   }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
