const express = require('express');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/', authController.authenticate, cartController.addItemToCart);
router.get('/', authController.authenticate, cartController.getCartItem);

module.exports = router;
