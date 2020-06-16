const {Order, CartItem} = require('../models/order');
const {errorHandler} = require('../helpers/dbErrorHandler');
 

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
    .populate('product.item', 'name price')
    .exec((err, order) => {
        if(err || !order) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        req.order = order;
        next();
    });
};

exports.create =(req, res) => {
    // console.log("CREATE ORDER:", req.body);
    req.body.order.user = req.profile;
    const order = new Order(req.body.order)
    order.save((error, data) => {
        if(error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.listOrders = (req, res) => {
    Order.find()
    .populate('user', "_id name phone address")
    .sort('-created')
    .exec((error, orders) => {
        if(error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(orders);
    });
};

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId}, 
        {$set: {status: req.body.status} },
        (err, order) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            console.log(order);
            res.json(order);
        }
    );
};
exports.deleteOrder = (req, res) => {
    Order.findOneAndDelete(
        {
            _id: req.order._id
        }, (error, order) => {
            if(error) {
                return res.status(400).json({
                    error: 'you are not authorised to do that'
                });
            }
            res.json(order);
        }
    );
}

