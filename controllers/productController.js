const Product = require('../models/Product');

const productController = {};
const PAGE_SIZE = 5;

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
    const { page, name } = req.query;
    const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
    let response = { status: 'success' };
    let query = Product.find(cond);

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.countDocuments(cond);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.total = totalPageNum;
    }

    const productList = await query.exec();
    response.data = productList;

    if (!productList || productList.length === 0) {
      const error = new Error('제품이 없습니다.');
      error.status = 404;
      return next(error);
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

productController.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
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

    const product = await Product.findByIdAndUpdate(
      productId,
      { sku, name, size, image, category, description, price, stock, status },
      { new: true }
    );
    if (!product) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 400;
      return next(error);
    }
    res.status(200).json({ status: 'success', product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = productController;
