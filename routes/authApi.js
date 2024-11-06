const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.loginEmail);
router.post('/google', authController.loginWithGoogle);

module.exports = router;
