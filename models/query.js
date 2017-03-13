var mongoose = require('mongoose');

var querySchema = mongoose.Schema({
	query: String,
	date: Date
});

module.exports = mongoose.model('Query', querySchema);