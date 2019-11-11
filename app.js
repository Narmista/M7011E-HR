const express = require('express');
const app = express();
const morgan = require('morgan');

const weatherRoute = require('./api/routes/weather');
const electricityConsumptionRoute = require('./api/routes/electricityConsumption');

//Logging
app.use(morgan('dev'));

app.use('/weather', weatherRoute);
app.use('/electricityConsumption', electricityConsumptionRoute);


module.exports = app;