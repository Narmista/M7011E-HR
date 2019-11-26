const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');


const weatherRoute = require('./api/routes/weather');
const electricityConsumptionRoute = require('./api/routes/electricityConsumption');
const userRoute = require('./api/routes/user');

mongoose.connect('mongodb+srv://Narmista:n4ku7cfe@cluster0-zgvcg.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser: true
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Logging 
app.use(morgan('dev'));

app.use('/weather', weatherRoute);
app.use('/electricityConsumption', electricityConsumptionRoute);
app.use('/user', userRoute);


module.exports = app;