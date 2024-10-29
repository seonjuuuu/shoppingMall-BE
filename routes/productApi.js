const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

router.post(
  '/',
  authController.authenticate,
  authController.checkAdminPermission,
  productController.createProduct
);

router.get('/', productController.getProduct);
router.put(
  '/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  productController.updateProduct
);
router.delete(
  '/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  productController.deleteProduct
);

router.get('/delete', productController.getDeleteProduct);

module.exports = router;
