const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, adminById }  = require('../controllers/user');
const { create, list, subCategoryById, read, update, remove, photo, subCategoryByCategory }  = require('../controllers/subCategory');
const { categoryById } = require('../controllers/category');

router.post(
        '/subcategory/create/:userId', 
        requireSignin, 
        isAuth, 
        isAdmin,
        create
    );

router.get('/subcategory/list', list);
router.get('/subcategory/:subCategoryId', read);
router.put('/subcategory/:subCategoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/subcategory/category/:categoryId', subCategoryByCategory);
router.get("/subcategory/photo/:subCategoryId", photo);
router.delete('/subcategory/:subCategoryId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('adminId', adminById);
router.param('userId', userById);
router.param('categoryId', categoryById);
router.param('subCategoryId', subCategoryById);

module.exports = router;