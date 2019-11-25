const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Consumption = require('../models/electricityConsumption');

function gaussianRandom(mean,sigma){ //https://gist.github.com/supereggbert/fe5fb7b1fc30609e983b0207ae136707
  var u = Math.random();
  return (u%1e-8>5e-9?1:-1)*Math.sqrt(-Math.log(Math.max(1e-9,u)))*sigma+mean;
}

router.get('/', (req, res, next) => {
	var elecConsumption = gaussianRandom(8,1);
	const consumption = new Consumption({
		id: 10,
		consumption: elecConsumption
	})
	consumption.save().then(result => {
		console.log(result);
	});

	res.json({elecConsumption});


});



module.exports = router;