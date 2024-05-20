const express = require('express');
const router = express.Router();
const { isAuthenticateUser } = require('../middlewares/authenticate');
const { isAdmin } = require('../controllers/authController');
const { createCategory, getAllCategory, getaCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.route('/catalog/category/').post(isAuthenticateUser, isAdmin, createCategory);
router.route('/catalog/category/').get(isAuthenticateUser, isAdmin, getAllCategory);
router.route('/catalog/category/:id').get(isAuthenticateUser, isAdmin,getaCategory)
.put(isAuthenticateUser, isAdmin, updateCategory)
.delete(isAuthenticateUser, isAdmin, deleteCategory);
module.exports = router;