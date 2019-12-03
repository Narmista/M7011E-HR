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
          res.json({
            token
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


module.exports = router;