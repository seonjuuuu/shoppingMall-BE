const { query } = require('express');
const Product = require('../models/Product');

const productController = {};
const PAGE_SIZE = 5;

const setDeleteStatus = async (productId, isDeleted) => {
  return await Product.findByIdAndUpdate(
    productId,
    { isDeleted },
    { new: true }
  );
};

const getProduct = async (isDeleted = false, page, name = '') => {
  const cond = { isDeleted };
  if (name) {
    cond.name = { $regex: name, $options: 'i' };
  }
  const query = Product.find(cond).sort({ createdAt: -1 });
  let totalPageNum;

  if (page) {
    query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
    const totalItemNum = await Product.countDocuments(cond);
    totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
  }
  const productList = await query.exec();

  return {
    total: totalPageNum,
    data: productList,
  };
};

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
    const response = await getProduct(false, page, name);
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
    const product = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      { new: true }
    );

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

productController.getDeleteProduct = async (req, res, next) => {
  try {
    const { page, name } = req.query;
    const response = await getProduct(true, page, name);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

productController.getProductDetail = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productDetail = await Product.findById({ _id: productId });
    if (!productDetail) {
      const error = new Error('제품이 없습니다.');
      error.status = 400;
      return next(error);
    }

    res.status(200).json({ status: 'success', data: productDetail });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = productController;
