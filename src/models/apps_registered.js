const mongoose = require('mongoose');
const {Schema} = mongoose;

const AppSchema = new Schema({
	name: String,
	token: String,
	expires_on: String,
});

module.exports = mongoose.model('App', AppSchema);
