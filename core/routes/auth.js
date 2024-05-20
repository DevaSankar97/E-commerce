const express = require('express');
const router = express.Router();
const { register, login, getAllUser, logout, isAdmin, isAdminOrUser, getUserById, updateUserById, deleteUserById, updateRole, addAddress } = require('../controllers/authController');
const { getProfile, forgotPassword, resetPassword, updateProfile, deleteProfile } = require('../controllers/authController');
const { isAuthenticateUser } = require('../middlewares/authenticate');
const multer=require('multer');
const path = require('path');

var Storage= multer.diskStorage({
    destination:"./uploads/avatar/",
    filename: (req, file, cb)=>{
        // console.log(req.file.path)
        // console.log(file)
       cb(null, file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    }
  }
);

var upload = multer({
    storage:Storage
  }).single('avatar');

router.route('/auth/register/').post(register);
router.route('/auth/login/').post(login);
router.route('/auth/logout/').post(logout);
router.route('/auth/forgot-password/').post(forgotPassword);
router.route('/auth/role/').put(isAuthenticateUser, updateRole);
router.route('/auth/reset-password/:token').post(isAuthenticateUser, isAdminOrUser, resetPassword);
router.route('/auth/profile/').get(isAuthenticateUser, getProfile)
    .put(isAuthenticateUser, updateProfile)
    .delete(isAuthenticateUser, isAdmin, deleteProfile);
router.route('/auth/profile/address/').post(isAuthenticateUser, addAddress)
// Admin router
router.route('/auth/admin/users/').get(getAllUser);
router.route('/auth/admin/user/:id').get(getUserById)
    .put(upload,updateUserById)
    .delete(deleteUserById);

module.exports = router;


