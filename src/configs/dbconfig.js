const mongoose = require('mongoose');
const config = require('./index');
const Role = require('../models/apps_registered');

//setting up the database based on the node env
const mongouri = config[config.NODE_ENV].MONGODB_URI;

const dbConnection = async () => {
	try {
		const connect = mongoose.connect(mongouri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});
		if (connect) {
			await mongoose.connection.on('connected', () => {
				console.log(
					'mongoose connection is now open.. database connected succesfully'
				);
			});

			await mongoose.connection.on('disconnected', () => {
				console.log('mongoose default connection is disconnected');
			});
		}
	} catch (error) {
		console.log(`error in connecting to database >>> ${error.message}`);
	}
};

module.exports = dbConnection;
