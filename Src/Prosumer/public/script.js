const fetch = require('node-fetch');

function getWeather(){
	fetch('https://172.31.31.157:3000')
	  .then(response => response.json())
	  .then(data => {
	    console.log(data)
	  })
	  .catch(err => ...)

}

