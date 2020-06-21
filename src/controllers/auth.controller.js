const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authModel = require('../models/auth.model');
const App = require('../models/apps_registered');
const config = require('../configs/index');
const {validationResult} = require('express-validator');

exports.registerForToken = async (req, res) => {
	const {app_name} = req.body;
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

		const app = new App({
			name: app_name,
		});

		const token = await jwt.sign({app_name}, config.JWT_SECRET, {
			expiresIn: '1y',
		});

		//generate expiry date in ISO format
		const expiryDate = new Date(
			new Date().setFullYear(new Date().getFullYear() + 1)
		).toISOString();

		app.token = token;
		app.expires_on = expiryDate;

		const saveApp = await app.save();
		return res.status(200).json({
			accesstoken: saveApp.token,
			type: 'bearer',
			expires_on: saveApp.expires_on,
		});
	} catch (error) {
		console.log(
			`error in the registration of the application >>> ${error.message}`
		);
		return res.status(500).json({
			message: 'An error occured while trying to register... try again later',
		});
	}
};

exports.signUp = async (req, res) => {
	const {auth_credentials, user_details} = req.body;
	const app_name = req.app.app_name;
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

		const details = new authModel({
			app_name,
			auth_credentials,
			user_details,
		});

		const user = await details.save();

		return res.status(201).json({
			message: `Successfully registered user on ${app_name} app`,
			userId: user._id,
			username: user.auth_credentials.username,
		});
	} catch (error) {
		console.log(`error in signing up user >>> ${error.message}`);
		return res.status(500).json({
			message: 'An error occured while trying to register... try again later',
		});
	}
};

exports.signIn = async (req, res) => {
	const {auth_credentials} = req.body;
	const app_name = req.app.app_name;
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
			User: user.auth_credentials.username,
			user_token: user.auth_credentials.token,
		});
	} catch (error) {
		console.log(`error in signing user in >>> ${error.message}`);
		return res.status(500).json({
			message: 'An error occured while trying to log in... try again later',
		});
	}
};

exports.checkStatus = async (req, res) => {
	try {
		const grabUserData = req.user;
		const grabapp = req.app;

		const user = await authModel
			.findOne({_id: grabUserData.userId, app_name: grabapp.app_name})
			.select(
				'-__v -app_name -auth_credentials.token -auth_credentials.password -user_details.email -user_details.role'
			);

		if (!user) {
			return res.status(404).json({
				status: 'Not a user',
				message: 'User is not registered on this application',
			});
		}
		if (Math.floor(Date.now() / 1000) >= grabUserData.exp) {
			return res.status(412).json({
				status: 'Token expired',
				message: 'You need to log in to access this page',
			});
		}

		return res.status(200).json({
			status: 'success',
			data: {
				userinfo: user,
				expires_on: new Date(Math.floor(grabUserData.exp * 1000)), //in ISO format
				app: grabapp.app_name,
			},
		});
	} catch (error) {
		console.log(`error in checking user's status >>> ${error.message}`);
		return res.status(500).json({
			message:
				'An error occured while trying to proccess your request... try again later',
		});
	}
};
