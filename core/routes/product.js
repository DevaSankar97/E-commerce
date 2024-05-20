const express = require('express');
const router = express.Router();
const { isAuthenticateUser } = require('../middlewares/authenticate');
const { createProduct, getaProduct, getAllProduct, deleteProduct, updateProduct,rating, wishList, cart, getCart, applyCoupon, deleteCart, order } = require('../controllers/productController');
const { isAdmin } = require('../controllers/authController');

router.route('/catalog/product/').post(isAuthenticateUser, isAdmin, createProduct)
router.route('/catalog/product/').get(getAllProduct);
router.route('/catalog/product/rating').post(isAuthenticateUser,rating);
router.route('/catalog/product/wishlist').post(isAuthenticateUser,wishList);
router.route('/catalog/product/cart').post(isAuthenticateUser,cart)
.get(isAuthenticateUser,getCart)
.delete(isAuthenticateUser,deleteCart);
router.route('/catalog/product/apply-coupon').post(isAuthenticateUser,applyCoupon)
router.route('/catalog/product/order').post(isAuthenticateUser,order)
router.route('/catalog/product/:id').get(isAuthenticateUser, isAdmin, getaProduct)
    .put(isAuthenticateUser, isAdmin, updateProduct)
    .delete(isAuthenticateUser, isAdmin, deleteProduct);
module.exports = router;