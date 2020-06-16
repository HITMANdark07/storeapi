const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const SubCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:true
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    photo:{
        data: Buffer,
        contentType:String
    }
},
{timestamps:true}
);


module.exports = mongoose.model('SubCategory', SubCategorySchema);