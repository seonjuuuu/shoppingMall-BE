const express = require('express');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/', authController.authenticate, cartController.addItemToCart);
router.get('/', authController.authenticate, cartController.getCartItem);
router.get('/qty', authController.authenticate, cartController.getCartQty);
router.delete(
  '/:id',
  authController.authenticate,
  cartController.deleteCartItem
);

router.put('/:id', authController.authenticate, cartController.updateQty);

module.exports = router;
