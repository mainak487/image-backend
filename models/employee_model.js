// IMPORT MONGOOSE 
const model_mongoose = require('mongoose');

//CREATE MODEL Employee means Employee Information
let EmployeeModel = model_mongoose.model('emp_model_collections', 
{
    empimage: { type: String },
    empname: { type: String },
    empemail: { type: String },
    empmobile: { type: String },
    empdob: { type: String },
    emppass: { type: String },
    empgender: { type: String },
    empcountry: { type: String },
    empaddress: { type: String },
	regdatetime: { type: Date, default: Date.now }
});

//EXPORT MODULE Employee using BINDING
module.exports = EmployeeModel ;
