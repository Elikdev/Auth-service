const mongoose = require('mongoose');
const config = require('./index');
const Role = require('../models/role.model');

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

			await initial();
		}
	} catch (error) {
		console.log(`error in connecting to database >>> ${error.message}`);
	}
};

async function initial() {
	try {
		const count = await Role.estimatedDocumentCount();

		if (count === 0) {
			const role = new Role({
				name: 'basic',
			});
			const savedRole = await role.save();
			if (savedRole) {
				console.log(`Added role 'basic' to roles collection`);
			}

			const role2 = new Role({
				name: 'admin',
			});
			const savedRole2 = await role2.save();
			if (savedRole2) {
				console.log(`Added role 'admin' to roles collection`);
			}
		}
	} catch (error) {
		console.log(`Error in intializing role >>> ${error.stack}`);
	}
}

module.exports = dbConnection;
