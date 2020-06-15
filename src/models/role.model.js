const mongoose = require('mongoose');
const {Schema} = mongoose;

const RoleSchema = new Schema({
	name: {
		type: String,
		enum: ['admin', 'basic'],
		default: 'basic',
	},
});

module.exports = mongoose.model('Role', RoleSchema);
