const express = require('express');
const userApi = require('./userApi');
const authApi = require('./authApi');

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);

module.exports = router;
