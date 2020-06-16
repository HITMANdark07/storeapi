const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, addOrderToUserHistory, adminById }  = require('../controllers/user');
const { create, listOrders, getStatusValues, orderById, updateOrderStatus, deleteOrder }  = require('../controllers/order');

router.post(
        '/order/create/:userId', 
        requireSignin, 
        isAuth, 
        addOrderToUserHistory,
        create
    );

router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);
router.get('/order/status-value/:userId', requireSignin, isAuth, isAdmin, getStatusValues);
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);
router.delete('/order/:adminId/:orderId', deleteOrder);

router.param('adminId', adminById);
router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;