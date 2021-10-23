const schema_mongoose = require('mongoose');

const ImageSchema = schema_mongoose.Schema(
    {
        catagory: [String],
        img_path: { type: String },
        description: { type: String },
        authorid: { type: String},
        authorname: {type: String},
        authoremail: {type: String},
	    regdatetime: { type: Date, default: Date.now }
    },
    {
        timestamps: true
    }
);

module.exports = schema_mongoose.model('image_schema_collection', ImageSchema);