const Product = require('../models/Product');

const productController = {};

const setDeleteStatus = async (productId, isDeleted) => {
  return await Product.findByIdAndUpdate(
    productId,
    { isDeleted },
    { new: true }
  );
};

const getProduct = async (isDeleted = false, page, name = '', limit = 5) => {
  const cond = { isDeleted };
  if (name) {
    cond.name = { $regex: name, $options: 'i' };
  }
  const query = Product.find(cond).sort({ createdAt: -1 });
  let totalPageNum;

  if (page) {
    query.skip((page - 1) * limit).limit(limit);
    const totalItemNum = await Product.countDocuments(cond);
    totalPageNum = Math.ceil(totalItemNum / limit);
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
    const { page, name, limit } = req.query;
    const response = await getProduct(false, page, name, limit);
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
    const product = await setDeleteStatus(productId, true);

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

productController.updateState = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { status } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { status },
      { new: true }
    );
    if (!product) {
      const error = new Error('상품이 없습니다.');
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

productController.checkStock = async (item) => {
  const product = await Product.findById(item.productId);  
  if(product.stock[item.size] < item.qty) {
    return {isVerify: false, message: `${product.name}의 ${item.size} 사이즈 재고가 부족합니다.`};
  } 
  const newStock = {...product.stock};
  newStock[item.size] -= item.qty
  product.stock = newStock;
  await product.save();
  return {isVerify: true};
}

productController.checkItemListStock = async (orderList) => {
  const insufficientStockItems = [];

  await Promise.all(
    orderList.map(async (item) => {
      const stockCheck = await productController.checkStock(item);
      if(!stockCheck.isVerify) {
        insufficientStockItems.push({productId: item.productId, message: stockCheck.message});
      }
      return stockCheck;
  }));
  return insufficientStockItems;
}

module.exports = productController;
