const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const TrendingBanner = require('../models/trendingBanner');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.trendingBannerById = (req, res, next, id) => {
    TrendingBanner.findById(id)
    .exec((err, trendingBanner)=>{
        if(err || !trendingBanner) {
            return res.status(400).json({
                error:"trendingBanner not found"
            });
        } 
        req.trendingBanner = trendingBanner;
        next();
    });
};

exports.read = (req, res)=>{
    req.trendingBanner.photo = undefined;
    return res.json(req.trendingBanner);
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



        let trendingBanner = new TrendingBanner(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            trendingBanner.photo.data = fs.readFileSync(files.photo.path);
            trendingBanner.photo.contentType = files.photo.type
        }

        trendingBanner.save((err, result)=>{
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
    let trendingBanner = req.trendingBanner;
    trendingBanner.remove((err, deletedTrendingBanner)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            deletedTrendingBanner,
            message: 'TrendingBanner deleted Successfully'
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

        let trendingBanner = req.trendingBanner
        trendingBanner = _.extend(trendingBanner, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            trendingBanner.photo.data = fs.readFileSync(files.photo.path);
            trendingBanner.photo.contentType = files.photo.type
        }
        trendingBanner.save((err, result)=>{
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
    TrendingBanner.find()
         .select("-photo")
         .limit(limit)
         .exec((error, trendingBanners) => {
             if(error){
                 return res.status(400).json({
                     error: 'TrendingBanner not found'
                 });
             }
             res.json(trendingBanners);
         });
 };


exports.photo = (req, res, next) => {
    if(req.trendingBanner.photo.data){
        res.set('Content-Type', req.trendingBanner.photo.contentType);
        return res.send(req.trendingBanner.photo.data);
    }
    next();
};

