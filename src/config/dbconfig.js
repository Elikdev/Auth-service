const mongoose = require('mongoose');
const config = require('./index');

//setting up the database based on the node env
const mongouri = config[config.NODE_ENV].MONGODB_URI;

module.exports = () => {
	try {
		mongoose.connect(mongouri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});

		mongoose.connection.on('connected', () => {
			console.log(
				'mongoose connection is now open.. database connected succesfully'
			);
		});

		mongoose.connection.on('error', (error) => {
			console.log();
		});
		mongoose.connection.on('disconnected', () => {
			console.log('mongoose default connection is disconnected');
		});
	} catch (error) {
		console.log(`error in connecting to database >>> ${error.message}`);
	}
};
