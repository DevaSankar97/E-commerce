const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
   user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
   },
   products: [{
      product: {
         type: mongoose.Types.ObjectId,
         ref: 'Product'
      },
      quantity: Number
   }],
   priceInfo:{
      taxPrice: Number, // Tax price (calculated)
      shippingPrice: Number, // Shipping cost (set by user)
      totalPrice: Number, // Total price (tax + shipping + subtotal)  (calculated)
   },
   paymentInfo:{
      isPaid: Boolean, // If the customer has paid for the order (set by payment gateway)
      paidAt: Date, // Date when the customer was charged (set by payment gateway)
      methodOfPayment: String, // Method of payment used (set by payment gateway)
   },
   deliveryAddress: Object, // Delivery address provided by the user
   contact: String,
   status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Shipped', 'Delivered'],
      default: 'Pending'
   }
},{ timestamps: true });

// Methods
// orderSchema.methods.generatePDF = function generatePDF(callback){
//    let Order = this;
//    const pdfDoc = new PDFDocument();
//    const fontSize = 12;
//    const margin = 50;
//    var self = this;
//    // Add some metadata to the file
//    pdfDoc.info['Title'] = 'Invoice';
//    pdfDoc.info['Author'] = 'Jon Doe';
//    pdfDoc.info['Subject'] = 'Purchase Invoice';
//    pdfDoc.fontSize(fontSize).text(`Invoice No : ${self._id}`,{align:'left'},margin );
//    pdfDoc.moveDown();
   
//    pdfDoc.fontSize(8).text("Date : "+moment().format('MMM Do YYYY'),{align:'right'},pdfDoc.page.width - margin);
//    pdfDoc.rect(margin,pdfDoc.y,{width:545 , height:30}).fillAndStroke();
//    pdfDoc.line(margin,pdfDoc.y+30,margin+600,pdfDoc.y+30);
//    pdfDoc.moveDown();
   
//    pdfDoc.fontSize(8).text("Date : "+moment(new Date()).format("MMM DD YYYY"),{align:'right'},615-margin);
//    pdfDoc.addPage();
//    pdfDoc.text("Product Details",{align:"center"});
//    pdfDoc.fontSize(fontSize).table(
//        [
//            [{content: "Name", width: '20%'}, {content: "Quantity"}, {content: "Price"}],
//        ].concat(Order.products.map(function(row) {
//           row["name"]=row.product.name;
//           delete row.product;
//           return row;
//        })),
//        {
//            x: margin,
//            y: pdfDoc.heightOfLastLine() + margin,
//            width: 600 - (2*margin),
//            bodyStyle:{singleBorder:[true]},
//            headerRows:1,
//            columnStyles: {
//                name: { halign: 'left' },
//                quantity: { halign: 'right', style: 'bold' },
//                price: { halign: 'right', style: 'italic' }
//            }
//        });
   
//    pdfDoc.moveDown();
//    pdfDoc.text('Total Amount : $'+ Order.totalAmount,'center');   
//    pdfDoc.sign({
//      signData: Order.signedData,
//      signCert: fs.readFileSync('/home/ubuntu/.acme.sh/orderr_EAAQ97HqLgwBACIhAAFuRvxbZpFjGdCzTiVcOoXWlKUaNkSnfh'),
//      signCert: fs.readFileSync('/path/to/your/certificate'), // PEM formatted certificate
//      signKey: fs.readFileSync('/path/to/your/privatekey')// PEM formatted private key
//    });
//    return pdfDoc;
// };


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
