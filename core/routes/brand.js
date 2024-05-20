const express = require('express');
const router = express.Router();
const { isAuthenticateUser } = require('../middlewares/authenticate');
const { isAdmin } = require('../controllers/authController');
const { updateBrand,createBrand,getAllBrand, getaBrand, deleteBrand } = require('../controllers/brandController');

router.route('/catalog/brand/').post(isAuthenticateUser, isAdmin, createBrand)
.get(isAuthenticateUser, isAdmin, getAllBrand);
router.route('/catalog/brand/:id').get(isAuthenticateUser, isAdmin,getaBrand)
.put(isAuthenticateUser, isAdmin, updateBrand)
.delete(isAuthenticateUser, isAdmin, deleteBrand)
module.exports = router;