const authController = {};
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcryptjs');

authController.loginEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, '-createdAt -updatedAt -__v');

    if (!user) {
      const error = new Error('가입된 유저가 아닙니다.');
      error.status = 404;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error('아이디 또는 비밀번호가 잘못되었습니다');
      error.status = 401;
      return next(error);
    }

    const token = await user.generateToken();
    return res.status(200).json({ status: 'success', user, token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

authController.authenticate = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      const error = new Error('토큰이 없습니다.');
      error.status = 401;
      throw error;
    }
    const token = tokenString.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        const error = new Error('유효한 토큰이 아닙니다.');
        error.status = 401;
        throw error;
      }
      req.userId = payload._id;
      next();
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    const { userId } = req;
    console.log(userId);
    const user = await User.findById(userId);
    if (user.level !== 'admin') {
      const error = new Error('어드민 레벨이 아닙니다.');
      error.status = 400;
      next(error);
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = authController;
