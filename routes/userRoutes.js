const express = require('express');
const { register, login,forgotPassword,resetPassword } = require('../controller/authController');
const router = express.Router();


router.post('/signup', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;