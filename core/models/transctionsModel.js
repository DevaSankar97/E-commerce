const mongoose  = require('mongoose');

const transactionSchema = new mongoose.Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
   },
   amount: {
      type: Number,
      required: true
   },
   paymentMethod: {
      type: String,
      required: true
   },
   status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
   }
},{timestamps:true});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
