const express = require('express');
const userApi = require('./userApi');
const authApi = require('./authApi');
const productApi = require('./productApi');
const cartApi = require('./cartApi');
const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/product', productApi);
router.use('/cart', cartApi);

module.exports = router;
