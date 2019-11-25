const fetch = require('node-fetch');

function getWeather(){
	fetch('52.91.53.73:3000/weather')
	  .then(response => response.json())
	  .then(data => {
	    console.log(data)
	  })

}

	<script>
		$(document).ready(function() {
			var myJSON = "hej";
			$.getJSON("http://52.91.53.73:3000/electricityConsumption",function(json){
				myJSON = "hejdå";
  					
			});
			alert(myJSON);
		});
	</script>
