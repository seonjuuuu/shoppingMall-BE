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
      discountPrice,
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
      discountPrice,
    });
    await product.save();
    res.status(200).json({ status: 'success', product });
  } catch (error) {
    console.log(error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.sku) {
      res.status(400).json({
        status: 'fail',
        message: '이미 존재하는 sku입니다. 다른 sku를 입력해 주세요.',
      });
    }
    next(error);
  }
};

productController.getProduct = async (req, res, next) => {
  try {
    const { page, name } = req.query;
    const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
    let response = { status: 'success' };
    let query = Product.find(cond).sort({ createdAt: -1 });

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.countDocuments(cond);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.total = totalPageNum;
    }

    const productList = await query.exec();
    response.data = productList;

    if (!productList || productList.length === 0) {
      response.data = [];
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
      discountPrice,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        sku,
        name,
        size,
        image,
        category,
        description,
        price,
        stock,
        status,
        discountPrice,
      },
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

productController.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      const error = new Error('상품이 존재하지 않습니다.');
      error.status = 400;
      return next(error);
    }

    res
      .status(200)
      .json({ status: 'success', message: '삭제에 성공하였습니다.' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = productController;
