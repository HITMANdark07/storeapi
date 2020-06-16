const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Banner = require('../models/banner');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.BannerById = (req, res, next, id) => {
    Banner.findById(id)
    .exec((err, banner)=>{
        if(err || !banner) {
            return res.status(400).json({
                error:"category not found"
            });
        } 
        req.banner = banner;
        next();
    });
};

exports.read = (req, res)=>{
    req.banner.photo = undefined;
    return res.json(req.banner);
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
         const { name } = fields;

         if(!name){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }



        let banner = new Banner(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            banner.photo.data = fs.readFileSync(files.photo.path);
            banner.photo.contentType = files.photo.type
        }

        banner.save((err, result)=>{
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
    let banner = req.banner;
    banner.remove((err, deletedBanner)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            deletedBanner,
            message: 'Banner deleted Successfully'
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

        let banner = req.banner
        banner = _.extend(banner, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            banner.photo.data = fs.readFileSync(files.photo.path);
            banner.photo.contentType = files.photo.type
        }
        banner.save((err, result)=>{
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
    Banner.find()
         .select("-photo")
         .limit(limit)
         .exec((error, banners) => {
             if(error){
                 return res.status(400).json({
                     error: 'Banners not found'
                 });
             }
             res.json(banners);
         });
 };


exports.photo = (req, res, next) => {
    if(req.banner.photo.data){
        res.set('Content-Type', req.banner.photo.contentType);
        return res.send(req.banner.photo.data);
    }
    next();
};

