const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
	title: String,
	content: String,
	createdAt:{
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date
	}
});

module.exports = (connection) => connection.model('note', noteSchema);