const schema_mongoose = require('mongoose');

const UserSchema = schema_mongoose.Schema(
    {
    uname: { type: String },
    uemail: { type: String },
    umobile: { type: String },
    umessage: { type: String },
	regdatetime: { type: Date, default: Date.now }
    }, 
    {
       timestamps: true
    }
    );

module.exports = schema_mongoose.model('user_contact_schema_collection', UserSchema);