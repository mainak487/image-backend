// IMPORT EXPRESS SERVER
const express = require("express");

// USE Router FOR EXPRESS SERVER
const router = express.Router();
var nodemailer = require("nodemailer");

//IMPORT EMPLOYEE MODEL AND BIND IT
//const EmpModel = require('../models/employee_model');
const EmpModel = require("../models/employee_schema");
const ImageModel = require("../models/image_schema");
// URL :- localhost:4500/emp/register  (USING POSTMAN POST)
/*
{
  "empname": "Chandan",
  "empemail": "chan@gmail.com",
  "empmobile": "9831125144",
  "empdob": "05/09/1984",
  "emppass": "abcd",
  "empgender": "Male",
  "empcountry": "India",
  "empaddress": "Kol",
}
*/
// post is used to INSERT DOCUMENT/RECORD
// CALLBACK using lambda

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gmitcse1@gmail.com",
    pass: "gmit.cse@2022",
  },
});

router.post(
  "/register",
  (req, res) => {
    EmpModel.find({
      $or: [{ empemail: req.body.empemail }, { empmobile: req.body.empmobile }],
    }).then((response) => {
      if (response.length > 0) {
        return res.send({
          message:
            "Email Id or Mobile No Already exits in our Database Please Register with Other Credentials",
        });
      } else {
        const empobj = new EmpModel({
          empimage: req.body.empimage,
          empname: req.body.empname,
          empemail: req.body.empemail,
          empmobile: req.body.empmobile,
          empdob: req.body.empdob,
          emppass: req.body.emppass,
          empgender: req.body.empgender,
          empcountry: req.body.empcountry,
          empaddress: req.body.empaddress,
        }); //CLOSE EmpModel
        //INSERT/SAVE THE RECORD/DOCUMENT

        var mailOptions = {
          from: "gmitcse1@gmail.com",
          to: req.body.empemail,
          subject: "Registration Sucessfull",
          text: " your email is : " + req.body.empemail + " and your password is : " + req.body.emppass,
        };
        empobj
          .save()
          .then((inserteddocument) => {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                // console.log(error);
                res.status(500).send(error);
              } else {
                // console.log('Email sent: ' + info.response);
                res.status(200).send({ message: "Registration Successfull and mail send sucessfull" });
              }
            });
          }) //CLOSE THEN
          .catch((err) => {
            res
              .status(500)
              .send({ message: err.message || "Error in Employee Save " });
          });
      }
    });
  } //CLOSE CALLBACK FUNCTION BODY Line 27
); //CLOSE POST METHOD Line 26

router.post(
  "/upload",
  (req, res) => {
    //Create Object of Employee Model Class
    // And Receive value from request body and Store value within the Object
    const Imageobj = new ImageModel({
      catagory: req.body.catagory,
      img_path: req.body.img_path,
      description: req.body.description,
      authorid: req.body.authorid,
      authorname: req.body.authorname,
      authoremail: req.body.authoremail,
    }); //CLOSE EmpModel
    //INSERT/SAVE THE RECORD/DOCUMENT
    Imageobj.save()
      .then((inserteddocument) => {
        res
          .status(200)
          .send(
            "Image INSERED IN MONGODB DATABASE" + "<br>" + inserteddocument
          );
      }) //CLOSE THEN
      .catch((err) => {
        res
          .status(500)
          .send({ message: err.message || "Error in Iamge Save " });
      }); //CLOSE CATCH
  } //CLOSE CALLBACK FUNCTION BODY Line 27
); //CLOSE POST METHOD Line 26

// => localhost:4500/emp/remove/30     (USING POSTMAN DELETE)
//DELETE A DOCUMENT FROM MONGODB USING EMPID
//EmpModel.findOneAndRemove({"empid" : parseInt(req.params.empid)})

// => localhost:4500/emp/remove/abc@gmail.com     (USING POSTMAN DELETE)
//DELETE A DOCUMENT FROM MONGODB USING EMAILID

//// search image

router.get("/findimage/:catagory", (req, res) => {
  var myregex = new RegExp(req.params.catagory, "i");
  ImageModel.find({ catagory: myregex })
    .then((getsearchdocument) => {
      if (getsearchdocument.length > 0) {
        res.send(getsearchdocument);
      } else {
        return res
          .status(404)
          .send({ message: "Note not found with id " + req.params.catagory });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .send({
          message:
            "DB Problem..Error in Retriving with id " + req.params.catagory,
        });
    });
});

// more about image

router.get("/readimage/:imageid", (req, res) => {
  ImageModel.find({ _id: req.params.imageid })
    // .sort({ "createdAt": -1 })
    .then((images) => {
      res.status(200).send(images);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({ message: err.message || "Error in Fetch Images " });
    });
});

router.delete(
  "/removeemail/:emailid",
  (req, res) => {
    EmpModel.findOneAndRemove({ empemail: req.params.emailid })
      .then((deleteddocument) => {
        if (deleteddocument != null) {
          res
            .status(200)
            .send("DOCUMENT DELETED successfully!" + deleteddocument);
        } else {
          res.status(404).send("INVALID USER ID " + req.params.emailid);
        }
      }) //CLOSE THEN
      .catch((err) => {
        return res
          .status(500)
          .send({
            message:
              "DB Problem..Error in Delete with id " + req.params.emailid,
          });
      }); //CLOSE CATCH
  } //CLOSE CALLBACK FUNCTION BODY Line 60
); //CLOSE Delete METHOD Line 59

router.get("/seeall/:authuser", (req, res) => {
  ImageModel.find({ authorid: req.params.authuser })
    .sort({"createdAt" : 1 })
    .then((getalldocumentsfrommongodb) => {
      res.status(200).send(getalldocumentsfrommongodb);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error in Fetch IMAGES " });
    });
});

router.delete("/removeimagefromuser/:imageid", (req, res) => {
  ImageModel.remove({ _id: req.params.imageid })
    .then((deleteddocument) => {
      if (deleteddocument) {
        res
          .status(200)
          .send("DOCUMENT DELETED successfully!" + deleteddocument);
      } else {
        res.status(404).send("INVALID IMAGES ID " + req.params.imageid);
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .send({
          message: "DB Problem..Error in Delete with id " + req.params.imageid,
        });
    });
});

router.delete("/remove/:nid", (req, res) => {
  ImageModel.remove({ _id: req.params.nid })
    .then((deleteddocument) => {
      if (deleteddocument) {
        res
          .status(200)
          .send("DOCUMENT DELETED successfully!" + deleteddocument);
      } else {
        res.status(404).send("INVALID IMAGES ID " + req.params.nid);
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .send({
          message: "DB Problem..Error in Delete with id " + req.params.nid,
        });
    });
});

// localhost:4500/emp/10
//SEARCH EMPLOYEE BY EMPID
// "empid" : parseInt(req.params.empid) Convert empid String to Int
// EmpModel.find({"empid" : parseInt(req.params.empid)})

// localhost:4500/emp/abc@gmail.com
//SEARCH EMPLOYEE BY EMPEMAIL
// CALLBACK function for get method using lambda
router.get(
  "/search/:emailid",
  (req, res) => {
    EmpModel.find({ empemail: req.params.emailid })
      .then((getsearchdocument) => {
        if (getsearchdocument.length > 0) {
          res.send(getsearchdocument);
        } else {
          return res
            .status(404)
            .send({ message: "Note not found with id " + req.params.emailid });
        }
      }) //CLOSE THEN
      .catch((err) => {
        return res
          .status(500)
          .send({
            message:
              "DB Problem..Error in Retriving with id " + req.params.emailid,
          });
      }); //CLOSE CATCH
  } //CLOSE CALLBACK FUNCTION BODY Line 88
); //CLOSE GET METHOD Line 87

// BROWSER URL :- localhost:4500/emp
// get IS USED FOR FETCHING DOCUMENTS FROM MONGODB
// CALLBACK using lambda
router.get(
  "/",
  (req, res) => {
    EmpModel.find()
      .sort({"createdAt" : -1 })
      .then((getalldocumentsfrommongodb) => {
        res.status(200).send(getalldocumentsfrommongodb);
      }) //CLOSE THEN
      .catch((err) => {
        res
          .status(500)
          .send({ message: err.message || "Error in Fetch USER " });
      }); //CLOSE CATCH
  } //CLOSE CALLBACK FUNCTION BODY Line 110
); //CLOSE GET METHOD Line 109

router.get(
  "/ViewallUsrImgAdmin",
  (req, res) => {
    ImageModel.find()
      .sort({"createdAt" : -1 })
      .then((getalldocumentsfrommongodb) => {
        res.status(200).send(getalldocumentsfrommongodb);
      }) //CLOSE THEN
      .catch((err) => {
        res
          .status(500)
          .send({ message: err.message || "Error in Fetch User Images " });
      }); //CLOSE CATCH
  } //CLOSE CALLBACK FUNCTION BODY Line 110
); //CLOSE GET METHOD Line 109

router.post(
  "/logincheck",
  (req, res) => {
    console.log(req.body.empemail);
    console.log(req.body.emppass);
    //  console.log(req.body.empimage);
    EmpModel.find({ empemail: req.body.empemail, emppass: req.body.emppass })
      .then((getsearchdocument) => {
        if (getsearchdocument.length > 0) {
          res.send(getsearchdocument);
        } else {
          return res
            .status(404)
            .send({ message: "Note not found with id " + req.params.empid });
        }
      }) //CLOSE THEN
      .catch((err) => {
        return res
          .status(500)
          .send({
            message:
              "DB Problem..Error in Retriving with id " + req.params.empid,
          });
      }); //CLOSE CATCH
  } //CLOSE CALLBACK FUNCTION BODY
); //CLOSE GET METHOD

router.put(
  "/update",
  (req, res) => {
    EmpModel.findOneAndUpdate(
      { empemail: req.body.empemail },
      {
        $set: {
          empmobile: req.body.empmobile,
          emppass: req.body.emppass,
          empaddress: req.body.empaddress,
        },
      },
      { new: true }
    )
      .then((getupdateddocument) => {
        if (getupdateddocument != null)
          res.status(200).send("DOCUMENT UPDATED " + getupdateddocument);
        else res.status(404).send("INVALID EMAILID " + req.body.empemail);
      }) // CLOSE THEN
      .catch((err) => {
        return res
          .status(500)
          .send({
            message: "DB Problem..Error in UPDATE with id " + req.params.empid,
          });
      }); // CLOSE CATCH
  } //CLOSE CALLBACK FUNCTION Line No 108
); //CLOSE PUT METHOD Line No 107

//SHOULD BE EXPORTED
module.exports = router;
