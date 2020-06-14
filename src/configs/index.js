require('dotenv').config();
module.exports = {
	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	development: {
		MONGODB_URI:
			process.env.MONGOURI || 'mongodb://localhost:27017/auth-service-dev',
	},
	production: {
		MONGODB_URI: process.env.MONGOURI,
	},
};
