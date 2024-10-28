const Product = require('../models/Product');

const productController = {};

productController.createProduct = async (req, res, next) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    } = req.body;
    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    });
    await product.save();
    res.status(200).json({ status: 'success', product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

productController.getProduct = async (req, res, next) => {
  try {
    const product = await Product.find({});

    if (!product) {
      const error = new Error('제품이 없습니다.');
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = productController;
