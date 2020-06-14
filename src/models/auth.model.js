const {Schema, mongoose} = require('mongoose');

const authSchema = new Schema(
	{
		app_name: {
			type: String,
			required: true,
		},
		auth_credentials: {
			username: {
				type: String,
				unique: true,
			},
			password: {
				type: String,
			},
			email: {
				type: String,
				unique: true,
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
				unique: true,
			},
			role: {
				type: String,
				default: 'basic',
			},
		},
	},
	{timestamps: true}
);

module.exports = mongoose.model('Auth', authSchema);
