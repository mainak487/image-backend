var PORT = process.env.PORT || 4500;

const express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

var cors = require('cors')
app.use(cors())

const my_mongoose = require('./dbconnect_promise.js');
 
const employeeAPI = require('./controllers/employeeAPI_promise.js');
const usrcontactAPI = require('./controllers/usercontactAPI_promise');

//USE URL /emp - route to studentController 
app.use('/emp', employeeAPI);
app.use('/usercontact',usrcontactAPI);

// START THE EXPRESS SERVER. 4500 is the PORT NUMBER
app.listen(PORT, () => console.log('EXPRESS Server Started at Port No: '+`${PORT}`));
