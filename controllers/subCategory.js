const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const SubCategory = require('../models/subCategory');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.subCategoryById = (req, res, next, id) => {
    SubCategory.findById(id)
    .exec((err, subCategory)=>{
        if(err || !subCategory) {
            return res.status(400).json({
                error:"subCategory not found"
            });
        } 
        req.subCategory = subCategory;
        next();
    });
};


exports.subCategoryByCategory = (req, res) => {
    SubCategory.find({category: req.category._id})
    .select("-photo")
    .populate("category", 'name')
    .select("-photo")
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: "subCategory not found"
            });
        }
        res.json({
            data
        });
    });
}


exports.read = (req, res)=>{
    req.subCategory.photo = undefined;
    return res.json(req.subCategory);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        //check for all fields
         const { name, description} = fields;

         if(!name || !description){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }



        let subCategory = new SubCategory(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            subCategory.photo.data = fs.readFileSync(files.photo.path);
            subCategory.photo.contentType = files.photo.type
        }

        subCategory.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.remove = (req,res) => {
    let subCategory = req.subCategory;
    subCategory.remove((err, deletedSubCategory)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            deletedSubCategory,
            message: 'subCategory deleted Successfully'
        });
    });
};


exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let subCategory = req.subCategory
        subCategory = _.extend(subCategory, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            subCategory.photo.data = fs.readFileSync(files.photo.path);
            subCategory.photo.contentType = files.photo.type
        }
        subCategory.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.list = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    SubCategory.find()
         .select("-photo")
         .limit(limit)
         .exec((error, Subcategories) => {
             if(error){
                 return res.status(400).json({
                     error: 'Categories not found'
                 });
             }
             res.json(Subcategories);
         });
 };


exports.photo = (req, res, next) => {
    if(req.subCategory.photo.data){
        res.set('Content-Type', req.subCategory.photo.contentType);
        return res.send(req.subCategory.photo.data);
    }
    next();
};

