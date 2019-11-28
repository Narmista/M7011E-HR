const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const parser = require('body-parser');

const weatherRoute = require('./api/routes/weather');
const electricityConsumptionRoute = require('./api/routes/electricityConsumption');
const userRoute = require('./api/routes/user');

mongoose.connect('mongodb+srv://Narmista:n4ku7cfe@cluster0-zgvcg.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser: true
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

//Logging 
app.use(morgan('dev'));
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

app.use('/weather', weatherRoute);
app.use('/electricityConsumption', electricityConsumptionRoute);
app.use('/user', userRoute);


module.exports = app;