const mongoose = require('mongoose');

const dailyWindSchema = mongoose.Schema({
	date: String,
	windSpeed: Number
});

module.exports = mongoose.model('dailyWind', dailyWindSchema);