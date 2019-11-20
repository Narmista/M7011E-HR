const mongoose = require('mongoose');

const consumptionSchema = mongoose.Schema({
	id: Number,
	consumption: Number
	
});

module.exports = mongoose.model('Consumption', consumptionSchema);