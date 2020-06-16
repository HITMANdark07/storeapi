const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { userById, read, update,purchaseHistory, list, referal,adminById, deleteUser }  = require('../controllers/user');

router.get('/secret/:userId', requireSignin, isAuth,isAdmin, (req,res)=>{
    res.json({
        user: req.profile
    });
});

router.get('/users/:userId',requireSignin, isAuth, isAdmin, list);
router.get('/user/:userId', read);
router.put('/user/:adminId/:userId', update);
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);
router.get('/users/referals/:userId', referal);
router.delete('/user/:adminId/:userId', deleteUser);

router.param('adminId', adminById);
router.param('userId', userById);


module.exports =router;