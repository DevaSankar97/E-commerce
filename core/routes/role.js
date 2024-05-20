const express = require('express');
const router = express.Router();
const { isAuthenticateUser } = require('../middlewares/authenticate');
const { createRole, getaRole, getAllRole, deleteRole, updateRole } = require('../controllers/roleController');
const { isAdmin } = require('../controllers/authController');

router.route('/auth/role/').post(isAuthenticateUser, isAdmin, createRole)
    .get(getAllRole);
router.route('/auth/role/:id').get(isAuthenticateUser, isAdmin, getaRole)
    .put(isAuthenticateUser, isAdmin, updateRole)
    .delete(isAuthenticateUser, isAdmin, deleteRole);
module.exports = router;