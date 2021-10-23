// IMPORT MONGOOSE 
const model_mongoose = require('mongoose');

//CREATE MODEL Employee means Employee Information
let ImageModel = model_mongoose.model('image_model_collection', 
{
        catagory: { type: String },
        img_path: { type: String },
        description: { type: String },
        authorid: { type: String},
        authorname: {type: String},
        authoremail: {type: String},
	regdatetime: { type: Date, default: Date.now }
});

//EXPORT MODULE Employee using BINDING
module.exports = ImageModel ;
