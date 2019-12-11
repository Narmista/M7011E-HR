const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Consumption = require('../models/electricityConsumption');

function gaussianRandom(mean,sigma){ 
  var u = Math.random();
  return (u%1e-8>5e-9?1:-1)*Math.sqrt(-Math.log(Math.max(1e-9,u)))*sigma+mean;
}

router.get('/', checkAuth, (req, res, next) => {
	var elecConsumption = gaussianRandom(8,1);
	res.json({elecConsumption});
});

module.exports = router;