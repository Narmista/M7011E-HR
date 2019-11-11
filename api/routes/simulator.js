const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'get'
	});

});

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'post'
	});

});

module.exports = router;