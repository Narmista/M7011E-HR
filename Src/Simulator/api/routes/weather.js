const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const dailyWind = require('../models/dailyWind');


function gaussianRandom(mean,sigma){ //https://gist.github.com/supereggbert/fe5fb7b1fc30609e983b0207ae136707
  var u = Math.random();
  return (u%1e-8>5e-9?1:-1)*Math.sqrt(-Math.log(Math.max(1e-9,u)))*sigma+mean;
}

router.get('/dailyWeather', (req, res, next) => {
	var today = new Date();
	var currentDate = 3 +"/"+ today.getMonth()+"/"+ today.getFullYear();
	var dailyWeather;

	dailyWind.find({ date: currentDate }, {windSpeed: 1}).exec().then(wind => {
    	if (wind.length >= 1){
    		var speed = wind.windSpeed;
    		console.log("hejsan " + wind[0]);
    		//res.json({speed});
    	} else{
    		dailyWeather = gaussianRandom(2,4);
			if(dailyWeather<0){
				dailyWeather = dailyWeather*-1;
			}
	    	const saveWind = new dailyWind({
				date: currentDate,
				windSpeed: dailyWeather
			})
			saveWind.save().then(result => {
				console.log(result);
			});
			console.log("1 " + dailyWeather);
			res.json({dailyWeather});
    	}
	});
});

router.post('/currentWeather', (req, res, next) => {
	var dailyWeather = parseInt(req.body.dailyWeather);
	var currentWeather = gaussianRandom(dailyWeather,0.6);
	if(currentWeather<0){
		currentWeather = currentWeather*-1;
	}
	res.send({currentWeather});
});



module.exports = router;