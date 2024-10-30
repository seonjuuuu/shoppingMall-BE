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

cartController.getCartItem = async (req, res, next) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    });
    res.status(200).json({ state: 'success', data: cart ? cart.items : [] });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

cartController.getCartQty = async (req, res, next) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId });

    res
      .status(200)
      .json({ status: 'success', qty: cart ? cart.items.length : 0 });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

cartController.deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const cart = await Cart.findOne({ userId });

    cart.items = cart.items.filter((item) => !item._id.equals(id));
    await cart.save();

    res
      .status(200)
      .json({ status: 'success', qty: cart.items.length, data: cart.items });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = cartController;
