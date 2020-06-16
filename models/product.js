const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:10
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:true
    },
    subCategory:{
        type:ObjectId,
        ref:'SubCategory',
        required:true
    },
    size:{
        type:String,
        trim: true,
        maxlength:5
    },
    photo:{
        data: Buffer,
        contentType:String
    },
    count:{
        type:Number,
        trim:true,
        required:true,
        maxlength:10
    }
},
{timestamps:true}
);


module.exports = mongoose.model('Product', ProductSchema);