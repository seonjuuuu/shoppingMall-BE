const express = require('express');
const userApi = require('./userApi');
const authApi = require('./authApi');
const productApi = require('./productApi');

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/product', productApi);

module.exports = router;
