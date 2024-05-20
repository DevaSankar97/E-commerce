const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const errorMiddleware = require('./middlewares/error');
const auth = require('./routes/auth')
const role = require('./routes/role')
const brand = require('./routes/brand')
const category = require('./routes/category')
const product = require('./routes/product')
const coupon = require('./routes/coupon')
const cookies = require('cookie-parser');
const cors = require('cors')

app.use(cors())
app.use(cookies());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.static("uploads"));

app.use('/api/v1',auth);
app.use('/api/v1',role);
app.use('/api/v1',brand);
app.use('/api/v1',category);
app.use('/api/v1',product);
app.use('/api/v1',coupon);

app.use(errorMiddleware)

module.exports = app;