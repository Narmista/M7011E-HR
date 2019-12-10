const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const mongoose = require('mongoose');


const PowerPlant = require('../models/powerPlant');

router.get('/status', checkAuth, (req, res, next) => {
	PowerPlant.find({}).exec().then(powerplant => {
 		var status = powerplant[0]['status'];
 		res.json({status});
  	});
});

router.post('/start', checkAuth, (req, res, next) => {
	PowerPlant.find({}).exec().then(powerplant => {
 		var name = powerplant[0]['name'];
 		var myquery = { name: name };
    	var newvalues = { $set: {status: 2} };
    	PowerPlant.updateOne(myquery, newvalues, function(err, res) {
    	});
    	res.json({});
  	});
});

router.post('/starting', checkAuth, (req, res, next) => {
	PowerPlant.find({}).exec().then(powerplant => {
 		var name = powerplant[0]['name'];
 		var myquery = { name: name };
    	var newvalues = { $set: {status: 1} };
    	PowerPlant.updateOne(myquery, newvalues, function(err, res) {
    	});
    	res.json({});
  	});
});

router.post('/stop', checkAuth, (req, res, next) => {
	PowerPlant.find({}).exec().then(powerplant => {
 		var name = powerplant[0]['name'];
 		var myquery = { name: name };
    	var newvalues = { $set: {status: 0} };
    	PowerPlant.updateOne(myquery, newvalues, function(err, res) {
    	});
    	res.json({status});
  	});
});

router.get('/production', checkAuth, (req, res, next) => {
	PowerPlant.find({}).exec().then(powerplant => {
 		var production = powerplant[0]['production'];
 		res.json({production});
  	});
});

router.post("/updateBuffer", checkAuth, (req, res, next) => {
  PowerPlant.find({}).exec().then(powerplant => {
    var currentBuffer = powerplant[0]['buffer'];
    var name = powerplant[0]['name'];
    var newBuffer = currentBuffer + parseInt(req.body.buffer);
    var myquery = { name: name };
    var newvalues = { $set: {buffer: newBuffer} };
    PowerPlant.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({newBuffer});
  });
});

router.post("/setPrice", checkAuth, (req, res, next) => {
  PowerPlant.find({}).exec().then(powerplant => {
    var name = powerplant[0]['name'];
    var myquery = { name: name };
    var newvalues = { $set: {price: req.body.price} };
    PowerPlant.updateOne(myquery, newvalues, function(err, res) {
    });
    res.json({newBuffer});
  });
});

router.post("/producePower", checkAuth, (req, res, next) => {
  PowerPlant.find({}).exec().then(powerplant => {
      var name = powerplant[0]['name'];
      var production = powerplant[0]['production'];
      var myquery = { name: name };
    if(powerplant[0]['status'] == 2){
      var newvalues = { $set: {currentPower: production} };
      PowerPlant.updateOne(myquery, newvalues, function(err, res) {
      });
    }else{
      var newvalues = { $set: {currentPower: 0} };
      PowerPlant.updateOne(myquery, newvalues, function(err, res) {
      });
    }
    res.json({});
  });
});

router.post("/buyPower", checkAuth, (req, res, next) => {
  var enoughPower = false;
  PowerPlant.find({}).exec().then(powerplant => {
      var name = powerplant[0]['name'];
      var currentPower = powerplant[0]['currentPower'];
      var currentBuffer = powerplant[0]['buffer'];
      var newPower = currentPower + parseInt(req.body.power);
      var newBuffer = currentBuffer + parseInt(req.body.power);
      if(newPower >= 0){
        var myquery = { name: name };
        var newvalues = { $set: {currentPower: newPower} };
        PowerPlant.updateOne(myquery, newvalues, function(err, res) {
        });
        enoughPower = true;
        res.json({enoughPower});
      }else if(newBuffer >= 0){
        var myquery = { name: name };
        var newvalues = { $set: {buffer: newBuffer} };
        PowerPlant.updateOne(myquery, newvalues, function(err, res) {
        });
        enoughPower = true;
        res.json({enoughPower});
      }else{
        enoughPower = false;
        res.json({enoughPower});
      }
    });  
});

router.post("/sellPower", checkAuth, (req, res, next) => {
  PowerPlant.find({}).exec().then(powerplant => {
      var name = powerplant[0]['name'];
      var currentBuffer = powerplant[0]['buffer'];
      var newBuffer = currentBuffer + parseInt(req.body.power);
      var myquery = { name: name };
      var newvalues = { $set: {buffer: newBuffer} };
      PowerPlant.updateOne(myquery, newvalues, function(err, res) {
      });
      res.json({});
    });  
});


router.get("/getPrice", checkAuth, (req, res, next) => {
  PowerPlant.find({}).exec().then(powerplant => {
    var price = powerplant[0]['price'];
    res.json({price});
  });
});



module.exports = router;