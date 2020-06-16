const {check, body} = require('express-validator');
const authModel = require('../models/auth.model');

const userSignUpValidationRules = () => {
	return [
		check('app_name', 'Include the app name').notEmpty(),
		check(
			'auth_credentials',
			'Include the authentication credentials'
		).notEmpty(),
		check('user_details', 'Include the user details').notEmpty(),
		check('auth_credentials.password').notEmpty(),
		check('auth_credentials.email', 'Enter a valid email').optional().isEmail(),
		body('auth_credentials.email')
			.optional()
			.custom((value, {req}) => {
				if (value != req.body.user_details.email) {
					throw new Error('Email must match user details');
				}
				return authModel
					.findOne({
						app_name: req.body.app_name,
						'auth_credentials.email': value,
					})
					.then((user) => {
						if (user) {
							return Promise.reject('e-mail already in use');
						}
					});
			}),
		body('auth_credentials.username')
			.optional()
			.custom((value, {req}) => {
				return authModel
					.findOne({
						app_name: req.body.app_name,
						'auth_credentials.username': value,
					})
					.then((user) => {
						if (user) {
							return Promise.reject('username has been taken');
						}
					});
			}),
	];
};

const userSignInValidationRules = () => {
	return [
		check('app_name', 'Include the app name').notEmpty(),
		check(
			'auth_credentials',
			'Include the authentication credentials'
		).notEmpty(),
		check('auth_credentials.password', 'password cannot be empty').notEmpty(),
		body('app_name').custom((value) => {
			return authModel.find({app_name: value}).then((app) => {
				if (app.length == 0) {
					return Promise.reject(
						`${value} does not use this service.. try and register the user`
					);
				}
			});
		}),
		body('auth_credentials.email')
			.optional()
			.custom((value, {req}) => {
				return authModel
					.findOne({
						app_name: req.body.app_name,
						'auth_credentials.email': value,
					})
					.then((user) => {
						if (user) {
							return Promise.reject(
								`Invalid email... user is not registered on ${req.body.app_name}`
							);
						}
					});
			}),
		body('auth_credentials.username')
			.optional()
			.custom((value, {req}) => {
				return authModel
					.findOne({
						app_name: req.body.app_name,
						'auth_credentials.username': value,
					})
					.then((user) => {
						if (!user) {
							return Promise.reject(
								`Invalid username... user is not registered on ${req.body.app_name}`
							);
						}
					});
			}),
	];
};

module.exports = {
	userSignUpValidationRules,
	userSignInValidationRules,
};
