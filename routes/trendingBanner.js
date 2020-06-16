const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, adminById }  = require('../controllers/user');
const { create, list, trendingBannerById, read, update, remove, photo }  = require('../controllers/trendingBanner');

router.post(
        '/trendingbanner/create/:userId', 
        requireSignin, 
        isAuth, 
        isAdmin,
        create
    );

router.get('/trendingbanner/list', list);
router.get('/trendingbanner/:trendingBannerId', read);
router.put('/trendingbanner/:trendingBannerId/:userId', requireSignin, isAuth, isAdmin, update);
router.get("/trendingbanner/photo/:trendingBannerId", photo);
router.delete('/trendingbanner/:trendingBannerId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('adminId', adminById);
router.param('userId', userById);
router.param('trendingBannerId', trendingBannerById);

module.exports = router;