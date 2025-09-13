const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
	name: {
		type: String, 
	},
	slug: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
	},
	dbUri: {
		type: String,
		required: true,
	},
	plan: {
		type: String,
		enum: ['free', 'pro'],
		default: 'free'
	}
})

module.exports = mongoose.model('tenant', tenantSchema);