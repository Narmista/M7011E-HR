const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const weatherRoute = require('./api/routes/weather');
const electricityConsumptionRoute = require('./api/routes/electricityConsumption');

mongoose.connect('mongodb+srv://Narmista:n4ku7cfe@cluster0-zgvcg.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser: true
})

//Logging 
app.use(morgan('dev'));

app.use('/weather', weatherRoute);
app.use('/electricityConsumption', electricityConsumptionRoute);


module.exports = app;