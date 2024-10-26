const authController = {};
const User = require('../models/User');
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

module.exports = authController;
