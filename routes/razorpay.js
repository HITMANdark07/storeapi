const router = require('express').Router();
const handlers = require('../controllers/razorpay');

router.post('/razorpay/create-order', (req, res) => handlers.CreateOrder(req,res));

module.exports = router;