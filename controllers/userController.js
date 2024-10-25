const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {};

userController.createdUser = async (req, res) => {
  try {
    const { email, password, name, level } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ status: 'fail', message: '이미 가입된 이메일 입니다.' });
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
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

module.exports = userController;
