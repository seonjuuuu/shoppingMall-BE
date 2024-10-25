const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {};

userController.createdUser = async (req, res, next) => {
  try {
    const { email, password, name, level } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error('이미 가입된 이메일 입니다.');
      error.status = 409;
      throw error;
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      level,
    });
    await newUser.save();

    return res
      .status(200)
      .json({ status: 'success', message: '회원가입에 성공하였습니다.' });
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
