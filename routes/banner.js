const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, adminById }  = require('../controllers/user');
const { create, list, BannerById, read, update, remove, photo }  = require('../controllers/banner');

router.post(
        '/banner/create/:userId', 
        requireSignin, 
        isAuth, 
        isAdmin,
        create
    );

router.get('/banner/list', list);
router.get('/banner/:bannerId', read);
router.put('/banner/:bannerId/:userId', requireSignin, isAuth, isAdmin, update);
router.get("/banner/photo/:bannerId", photo);
router.delete('/banner/:bannerId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('adminId', adminById);
router.param('userId', userById);
router.param('bannerId', BannerById);

module.exports = router;