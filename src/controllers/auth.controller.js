const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authModel = require('../models/auth.model');
const roleModel = require('../models/role.model');
const config = require('../configs/index');
const {validationResult} = require('express-validator');

exports.signUp = async (req, res) => {
	const {app_name, auth_credentials, user_details} = req.body;
	const errors = validationResult(req);
	try {
		//get validation results here
		if (!errors.isEmpty()) {
			let Errors = [];
			errors.array().map((err) => Errors.push({[err.param]: err.msg}));
			return res.status(422).json({
				Errors,
			});
		}

		if (auth_credentials.password) {
			//hash password before saving to database
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(auth_credentials.password, salt);
			auth_credentials.password = hashedPassword;
		}

		//set the role to basic user unless stated otherwise
		if (user_details.role) {
			let role = await roleModel.findOne({name: user_details.role});
			if (!role) {
				return res.status(404).json({
					message: 'Role is not found in the database',
				});
			}
			user_details.role = role._id;
		} else {
			role = await roleModel.findOne({name: 'basic'});
			if (role) {
				user_details.role = role._id;
			}
		}

		const details = new authModel({
			app_name,
			auth_credentials,
			user_details,
		});

		//generate token for user and save to database
		const token = jwt.sign({userId: details._id}, config.JWT_SECRET, {
			expiresIn: '1d',
		});

		details.auth_credentials.token = token;

		const user = await details.save();

		return res.status(201).json({
			message: `Successfully registered user on ${app_name} app`,
			userId: user._id,
			username: user.auth_credentials.username,
			accesstoken: token,
		});
	} catch (error) {
		console.log(`error in signing up user >>> ${error.message}`);
		return res.status(500).json({
			message: 'An error occured while trying to register... try again later',
		});
	}
};

// exports.verifyEmail = (req, res) => {};

exports.signIn = async (req, res) => {
	const {app_name, auth_credentials} = req.body;
	const errors = validationResult(req);

	try {
		//grab validation errors
		if (!errors.isEmpty()) {
			let Errors = [];
			errors.array().map((err) => Errors.push({[err.param]: err.msg}));
			return res.status(422).json({
				Errors,
			});
		}

		//find the user based on the app
		let user;

		//signIn by email
		if (auth_credentials.email) {
			user = await authModel.findOne({
				app_name: app_name,
				'auth_credentials.email': auth_credentials.email,
			});
		}

		//signIn by username
		if (auth_credentials.username) {
			user = await authModel.findOne({
				app_name: app_name,
				'auth_credentials.username': auth_credentials.username,
			});
		}

		//compare password
		const validPassword = await bcrypt.compare(
			auth_credentials.password,
			user.auth_credentials.password
		);

		if (!validPassword) {
			return res.status(401).json({
				message: 'Invalid email/username and password',
			});
		}

		//generate token for user and update in the auth database
		const token = jwt.sign({userId: user._id}, config.JWT_SECRET, {
			expiresIn: '1d',
		});

		user = await authModel
			.findByIdAndUpdate(
				user._id,
				{
					'auth_credentials.token': token,
				},
				{new: true}
			)
			.select('-__v');

		return res.status(200).json({
			message: `Successfully signed in user on ${app_name} app`,
			User: user,
		});
	} catch (error) {
		console.log(`error in signing user in >>> ${error.message}`);
		return res.status(500).json({
			message: 'An error occured while trying to log in... try again later',
		});
	}
};

// exports.adminCheck = (req, res) => {
// 	return res.status(200).json({
// 		message: 'admin content',
// 	});
// };
