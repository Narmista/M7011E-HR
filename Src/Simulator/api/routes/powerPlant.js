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



module.exports = router;