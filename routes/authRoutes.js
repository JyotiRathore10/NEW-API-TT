const express = require('express');
const loginController = require('../HRMS_Controllers/login');
const { changePassword, forgetPassword } = require('../HRMS_Controllers/UserManagment');

const router = express.Router();

// Authentication routes
router.post('/login', loginController.login);
router.post('/changePassword', changePassword);
router.post('/forgetPassword', forgetPassword);

module.exports = router;
