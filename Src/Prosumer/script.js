function getWeather(){
	window.alert("1");
	var apiURL = 'http://3.84.88.104:3000/weather'
	const response = await fetch(apiURL);
	const myJson = await response.json();
	console.log(JSON.stringify(myJson));
	window.alert("2");
}