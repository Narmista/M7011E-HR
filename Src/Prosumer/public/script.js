const fetch = require('node-fetch');

function getWeather(){
	fetch('52.91.53.73:3000/weather')
	  .then(response => response.json())
	  .then(data => {
	    console.log(data)
	  })

}

