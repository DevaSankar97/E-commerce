const express = require('express');
const router = express.Router();
const { isAuthenticateUser } = require('../middlewares/authenticate');
const { isAdmin } = require('../controllers/authController');
const { updateCoupon,createCoupon,getAllCoupon, getaCoupon, deleteCoupon } = require('../controllers/couponController');

router.route('/catalog/coupon/').post(isAuthenticateUser, isAdmin, createCoupon)
.get(isAuthenticateUser, isAdmin, getAllCoupon);
router.route('/catalog/coupon/:id').get(isAuthenticateUser, isAdmin,getaCoupon)
.put(isAuthenticateUser, isAdmin, updateCoupon)
.delete(isAuthenticateUser, isAdmin, deleteCoupon)
module.exports = router;