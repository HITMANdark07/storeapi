const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Carousal = require('../models/carousal');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.carousalById = (req, res, next, id) => {
    Carousal.findById(id)
    .exec((err, carousal)=>{
        if(err || !carousal) {
            return res.status(400).json({
                error:"category not found"
            });
        } 
        req.carousal = carousal;
        next();
    });
};

exports.read = (req, res)=>{
    req.carousal.photo = undefined;
    return res.json(req.carousal);
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



        let carousal = new Carousal(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            carousal.photo.data = fs.readFileSync(files.photo.path);
            carousal.photo.contentType = files.photo.type
        }

        carousal.save((err, result)=>{
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
    let carousal = req.carousal;
    carousal.remove((err, deletedCarousal)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            deletedCarousal,
            message: 'Carousal deleted Successfully'
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

        let carousal = req.carousal
        carousal = _.extend(carousal, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            carousal.photo.data = fs.readFileSync(files.photo.path);
            carousal.photo.contentType = files.photo.type
        }
        carousal.save((err, result)=>{
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
    Carousal.find()
         .select("-photo")
         .limit(limit)
         .exec((error, carousals) => {
             if(error){
                 return res.status(400).json({
                     error: 'Carousals not found'
                 });
             }
             res.json(carousals);
         });
 };


exports.photo = (req, res, next) => {
    if(req.carousal.photo.data){
        res.set('Content-Type', req.carousal.photo.contentType);
        return res.send(req.carousal.photo.data);
    }
    next();
};

