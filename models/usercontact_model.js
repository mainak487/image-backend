// IMPORT MONGOOSE 
const model_mongoose = require('mongoose');

//CREATE MODEL Employee means Employee Information
let UserModel = model_mongoose.model('user_contact_model_collection', 
{
    uname: { type: String },
    uemail: { type: String },
    umobile: { type: String },
    uaddress: { type: String },
	regdatetime: { type: Date, default: Date.now }
});

//EXPORT MODULE Employee using BINDING
module.exports = UserModel ;