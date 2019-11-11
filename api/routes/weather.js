const express = require('express');
const router = express.Router();

function gaussianRandom(mean,sigma){ //https://gist.github.com/supereggbert/fe5fb7b1fc30609e983b0207ae136707
  var u = Math.random();
  return (u%1e-8>5e-9?1:-1)*Math.sqrt(-Math.log(Math.max(1e-9,u)))*sigma+mean;
}

router.get('/', (req, res, next) => {
	var x = gaussianRandom(10,1);
	var y = gaussianRandom(x,1);
	res.status(200).json({
		message: 'Weather = ' + y
	});

});



module.exports = router;