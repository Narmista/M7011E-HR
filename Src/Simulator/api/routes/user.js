const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage});
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
	User.find({ username: req.body.username })
    .exec()
    .then(user => {
    if (user.length >= 1) {
        return res.status(409).json({
          message: "username exists"
        });
      } else {
 		bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              name: req.body.name,
              buffer: 0,
              role: 1,
              status: 0,
              netProduction: 0,
              blocked: 0,
              blackOut: 0,
              lastOnline: 0
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          var myquery = { username: user[0].username };
          var newvalues = { $set: {status: 1} };
          User.updateOne(myquery, newvalues, function(err, res) {
          });
          const token = jwt.sign(
            {
              username: user[0].username,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
          var role = user[0].role;
          res.json({
            token,
            role
          });
          return 
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
 
router.post("/updateBuffer", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  var name = decoded.username;

  var newBuffer;

  User.find({ username: name }, {buffer: 1}).exec().then(user => {
    var currentBuffer = user[0]['buffer'];
    newBuffer = currentBuffer + parseInt(req.body.buffer);
    var myquery = { username: name };
    var newvalues = { $set: {buffer: newBuffer} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({newBuffer});
  });
});

router.get("/getBuffer", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  var name = decoded.username;

  User.find({ username: name }, {buffer: 1}).exec().then(user => {
    var currentBuffer = user[0]['buffer'];
    res.json({currentBuffer});
  });
});

router.post('/uploadImage', upload.single('avatar'), (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  var name = decoded.username;

  User.find({ username: name }).exec().then(user => {
    var myquery = { username: name };
    var newvalues = { $set: {image: req.file.path} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
  });
});

router.get("/getImage", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  var name = decoded.username;

  User.find({ username: name }, {image: 1}).exec().then(user => {
    var icon = user[0]['image'];
    res.json({icon});
  });
});

router.post("/changeUser", (req, res, next) => {
  var response = 0; 
  var today = new Date();
  var currentDate = today.getHours() +":"+ today.getMinutes() +":"+ today.getSeconds() +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate2 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-1) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate3 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-2) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();

  User.find({"$or": [{
        "role": 1,
        "lastOnline": currentDate,
        "name": req.body.name
    }, {
        "role": 1,
        "lastOnline": currentDate2,
        "name": req.body.name
    }, {
        "role": 1,
        "lastOnline": currentDate3,
        "name": req.body.name
      }]}).exec().then(user => {
      if(user.length == 0){
        var myquery = { name: req.body.name };
        var newvalues = { $set: {username: req.body.newUsername} };
        User.updateOne(myquery, newvalues, function(err, res) {
        });
        response = 1;
        res.json({response});
      }else{
        res.json({response});
      }
  });
});

router.post("/changeName", (req, res, next) => {
  var response = 0; 
  var today = new Date();
  var currentDate = today.getHours() +":"+ today.getMinutes() +":"+ today.getSeconds() +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate2 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-1) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate3 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-2) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();

  User.find({"$or": [{
        "role": 1,
        "lastOnline": currentDate,
        "name": req.body.name
    }, {
        "role": 1,
        "lastOnline": currentDate2,
        "name": req.body.name
    }, {
        "role": 1,
        "lastOnline": currentDate3,
        "name": req.body.name
      }]}).exec().then(user => {
      if(user.length == 0){
        var myquery = { name: req.body.name };
        var newvalues = { $set: {name: req.body.newName} };
        User.updateOne(myquery, newvalues, function(err, res) {
        });
        response = 1;
        res.json({response});
      }else{
        res.json({response});
      }
  });
});

router.post("/changePass", (req, res, next) => {
  var response = 0; 
  var today = new Date();
  var currentDate = today.getHours() +":"+ today.getMinutes() +":"+ today.getSeconds() +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate2 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-1) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate3 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-2) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();

  User.find({"$or": [{
        "role": 1,
        "lastOnline": currentDate,
        "name": req.body.name
    }, {
        "role": 1,
        "lastOnline": currentDate2,
        "name": req.body.name
    }, {
        "role": 1,
        "lastOnline": currentDate3,
        "name": req.body.name
      }]}).exec().then(user => {
        if(user.length == 0){
        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
            error: err
            });
          } else {    
            var myquery = { name: req.body.name };
            var newvalues = { $set: {password: hash} };
            User.updateOne(myquery, newvalues, function(err, res) {
            });
          response = 1;
          res.json({response});
      }
      });
        }else{
        res.json({response});
      }
  });
});

router.post("/delete", (req, res, next) => {
  var response = 0; 
  var today = new Date();
  var currentDate = today.getHours() +":"+ today.getMinutes() +":"+ today.getSeconds() +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate2 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-1) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate3 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-2) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();

  User.find({"$or": [{
        "role": 1,
        "lastOnline": currentDate,
        "name": req.body.name
    }, {
        "role": 1,
        "lastOnline": currentDate2,
        "name": req.body.name
    }, {
        "role": 1,
        "lastOnline": currentDate3,
        "name": req.body.name
      }]}).exec().then(user => {
      if(user.length == 0){
        var myquery = { name: req.body.name };
        User.deleteOne(myquery, function(err, res) {
        });
        response = 1;
        res.json({response});
      }else{
        res.json({response});
      }
  });
});

router.post("/statusZero", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  var name = decoded.username;

  User.find({ username: name }).exec().then(user => {
    var myquery = { username: name };
    var newvalues = { $set: {status: 0} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({});
  });
});

router.post("/blocked", (req, res, next) => {
  User.find({ name: req.body.name}).exec().then(user => {
    var myquery = { name: req.body.name };
    var newvalues = { $set: {blocked: 1} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({});
  });
});

router.post("/unBlocked", (req, res, next) => {
  User.find({ name: req.body.name}).exec().then(user => {
    var myquery = { name: req.body.name}; 
    var newvalues = { $set: {blocked: 0} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({});
  });
});

router.get("/tokenExpire", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  res.json({});
});

router.get("/tokenZero", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY, {ignoreExpiration: true});
  var name = decoded.username;

  User.find({ username: name }).exec().then(user => {
    var myquery = { username: name };
    var newvalues = { $set: {status: 0} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({});
  });
});

router.post("/onlineCheck", (req, res, next) => {
  var today = new Date();
  var currentDate = today.getHours() +":"+ today.getMinutes() +":"+ today.getSeconds() +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate2 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-1) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate3 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-2) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();

  
  User.find({"$or": [{
        "role": 1,
        "lastOnline": currentDate
    }, {
        "role": 1,
        "lastOnline": currentDate2
    }, {
        "role": 1,
        "lastOnline": currentDate3
      }]}, {_id: 0, name: 1}).exec().then(user => {
    res.json({user});
  });
});

router.post("/usersCheck", (req, res, next) => {
  User.find({role: 1}, {_id: 0, name: 1}).exec().then(user => {
    res.json({user});
  });
});

router.post("/blackOutCheck", (req, res, next) => {
  var today = new Date();
  var currentDate = today.getHours() +":"+ today.getMinutes() +":"+ today.getSeconds() +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate2 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-1) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate3 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-2) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();

  
  User.find({"$or": [{
        "role": 1,
        "lastOnline": currentDate,
        "blackOut": 1
    }, {
        "role": 1,
        "lastOnline": currentDate2,
        "blackOut": 1
    }, {
        "role": 1,
        "lastOnline": currentDate3,
        "blackOut": 1
      }]}, {_id: 0, name: 1}).exec().then(user => {
    res.json({user});
  });
});

router.post("/getUserData", (req, res, next) => {
  User.find({ name: req.body.name}, {buffer: 1, netProduction: 1}).exec().then(user => {
    var buffer = user[0]['buffer'];
    var netProduction = user[0]['netProduction'];
    res.json({buffer, netProduction});
  });
});

router.post("/netProduction", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY, {ignoreExpiration: true});
  var name = decoded.username;

  User.find({ username: name }).exec().then(user => {
    var myquery = { username: name };
    var newvalues = { $set: {netProduction: req.body.netProduction} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({});
  });
});

router.post("/setBlackOut", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY, {ignoreExpiration: true});
  var name = decoded.username;

  User.find({ username: name }).exec().then(user => {
    var myquery = { username: name };
    var newvalues = { $set: {blackOut: 1} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({});
  });
});

router.post("/setNotBlackOut", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY, {ignoreExpiration: true});
  var name = decoded.username;

  User.find({ username: name }).exec().then(user => {
    var myquery = { username: name };
    var newvalues = { $set: {blackOut: 0} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({});
  });
});

router.post("/updateLastOnline", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY, {ignoreExpiration: true});
  var name = decoded.username;

  var today = new Date();
  var currentDate = today.getHours() +":"+ today.getMinutes() +":"+ today.getSeconds() +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();

  User.find({ username: name }).exec().then(user => {
    var myquery = { username: name };
    var newvalues = { $set: {lastOnline: currentDate} };
    User.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({});
  });
});

router.get("/getTotalNetProduction", (req, res, next) => {
  var today = new Date();
  var currentDate = today.getHours() +":"+ today.getMinutes() +":"+ today.getSeconds() +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate2 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-1) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();
  var currentDate3 = today.getHours() +":"+ today.getMinutes() +":"+ (today.getSeconds()-2) +" "+ today.getDate() +"/"+ (today.getMonth()+1) +"/"+ today.getFullYear();

  
  User.find({"$or": [{
        "role": 1,
        "lastOnline": currentDate
    }, {
        "role": 1,
        "lastOnline": currentDate2
    }, {
        "role": 1,
        "lastOnline": currentDate3
      }]}, {_id: 0, netProduction: 1}).exec().then(user => {
    res.json({user});
  });
});

module.exports = router;