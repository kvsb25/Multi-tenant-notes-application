const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		validate: {
		  validator: function(v) {
			return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
		  },
		  message: props => `${props.value} is not a valid email!`
		},
	},
	role: {
		type: String,
		enum: {
			values: ['admin', 'member'],
			message: 'role enum error message'
		},
		default: 'member'
	}
});

// module.exports = (connection) => connection.model('user', userSchema);
module.exports = userSchema;