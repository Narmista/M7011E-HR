const mongoose = require('mongoose');

const powerPlantSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	status: Number,
	buffer: Number,
	production: Number
});

module.exports = mongoose.model('PowerPlant', powerPlantSchema);