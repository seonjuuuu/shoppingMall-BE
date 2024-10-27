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

module.exports = productController;
