const Razorpay = require('razorpay')
module.exports = {
    CreateOrder: (req, res) => {
        console.log(req.body);
        var instance = new Razorpay({
            key_id: 'rzp_test_l1WQF4F00XldVi',
            key_secret: 'inoUun1oOocLrKJQjf63QQJb'
        })
        var options = {
            amount: req.body.amount,
            receipt: req.body.receipt,
            currency: "INR",
            payment_capture: '0'
        }
        instance.orders.create(options, function (err, order) {
            res.send(order)
        })
    }
}