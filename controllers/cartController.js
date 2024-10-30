const Cart = require('../models/Cart');

const cartController = {};

cartController.addItemToCart = async (req, res, next) => {
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }

    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );

    if (existItem) {
      const error = new Error('아이템이 이미 카트에 담겨 있습니다.');
      error.status = 400;
      return next(error);
    }

    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();

    res
      .status(200)
      .json({ status: 'success', data: cart, cartItemQty: cart.items.length });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = cartController;
