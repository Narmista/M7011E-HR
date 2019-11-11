const express = require('express');
const app = express();
const morgan = require('morgan');

const simulatorRoute = require('./api/routes/simulator');

//Logging
app.use(morgan('dev'));

app.use('/simulator', simulatorRoute);


module.exports = app;