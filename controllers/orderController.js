const Order = require('../models/Order');
const { randomStringGenerator } = require('../utils/randomStringGenerator');
const productController = require('./productController');

const orderController = {};

orderController.createOrder = async (req, res, next) => {
    try {
        const {userId} = req;
        const {shipTo, contact, orderList, totalPrice} = req.body;
        const insufficientStockItems = await productController.checkItemListStock(orderList);

        if(insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce((total, item) => total += item.message, '');
            const error = new Error(errorMessage);
            error.status = 400;
            return next(error);
        }
        const orderNum = randomStringGenerator();

        const newOrder = new Order({
            userId,
            shipTo,
            contact,
            items: orderList,
            totalPrice,
            orderNum
        });
        await newOrder.save();
        res.status(200).json({state: 'success', orderNum: orderNum});

    } catch(error) {
        console.log(error);
        next(error);
    }
}

module.exports = orderController;