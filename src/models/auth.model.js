const mongoose = require('mongoose');
const {Schema} = mongoose;

const authSchema = new Schema(
	{
		app_name: {
			type: String,
			required: true,
		},
		auth_credentials: {
			username: {
				type: String,
			},
			password: {
				type: String,
			},
			email: {
				type: String,
			},
			token: {
				type: String,
			},
		},
		user_details: {
			first_name: {
				type: String,
			},
			last_name: {
				type: String,
			},
			email: {
				type: String,
			},
			role: {
				type: String,
				default: 'Basic',
			},
		},
	},
	{timestamps: true}
);

module.exports = mongoose.model('Auth', authSchema);
