const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true
	},
	slug: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true
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

tenantSchema.pre('save', function(next) {
    if (!this.slug && this.name) {
        this.slug = this.name.trim().toLowerCase();
    }
    next();
});

module.exports = mongoose.model('tenant', tenantSchema);