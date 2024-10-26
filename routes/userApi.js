const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/', userController.createdUser);
router.get('/me', authController.authenticate, userController.getUser);

module.exports = router;
