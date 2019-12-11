const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	buffer: Number,
	image: String,
	role: Number,
	status: Number,
	netProduction: Number,
	blocked: Number,
	blackOut: Number
});

module.exports = mongoose.model('User', userSchema);