const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/', authController.authenticate, orderController.createOrder);
router.get('/', authController.authenticate, orderController.getOders);
router.put('/:orderId', authController.authenticate, orderController.updateOrder);

module.exports = router;