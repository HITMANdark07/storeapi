const User = require('../models/user');
const {Order} = require('../models/order');
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user)=>{
       if(err || !user) {
         return res.status(400).json({
            error: 'User not found'
        });
     }
        req.profile= user;
        next();
    });
};
exports.adminById = (req, res, next, id) => {
    User.findById(id).exec((err, user)=>{
        if(err || !user) {
          return res.status(400).json({
             error: 'User not found'
         });
      }
      
      if(user.role===1){
         return next();
      }
       return res.status(400).json({
           error: 'Admin Access Area'
       })
     });
};

exports.referal = (req, res) => {
    User.find({referal:req.profile._id})
    .populate('plan', "_id name")
    .exec((error, users) =>{
        if(error|| !users){
            res.status(400).json({
                error: 'No user Found'
            });
        }
        return res.json(users);
    })
};

exports.deleteUser = (req, res) => {
    User.findOneAndDelete(
        {
            _id: req.profile._id
        }, (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: 'You are not authorised to perform this actions'
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    );
}


exports.list = (req, res) => {
    User.find()
    .populate('plan', "_id name")
    .select("-hashed_password")
    .exec((error, users) => {
        if(error || !users) {
            return res.status(400).json({
                error:'No user found'
            });
        }
        res.json(users);
    });
};

exports.read = (req, res) => {
     req.profile.hashed_password = undefined;
     req.profile.salt = undefined;
     return res.json(req.profile);
};

exports.update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id }, 
        { $set: req.body }, 
        { new:true },
        (error, user) => {
            if(error) {
                return res.status(400).json({
                    error: 'You are not authorised to perform this actions'
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
        );
    
};

exports.addOrderToUserHistory = (req, res, next) => {
    let history= [];

    req.body.order.plan.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            transaction_id:req.body.order.transaction_id,
            amount:req.body.order.amount
        })
    })

    User.findOneAndUpdate(
            {_id: req.profile._id}, 
            {$push: {history:history}}, 
            {new: true},
            (error, data) => {
                if(error) {
                    return res.status(400).json({
                        error:"Could not update user purchase history"
                    });
                }
                next();
            }
        );
};

exports.purchaseHistory =(req, res) => {
    Order.find({user: req.profile._id})
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(orders);
    });
};