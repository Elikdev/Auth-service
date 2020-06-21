const jwt = require('jsonwebtoken');
const config = require('../configs/index');
const routes = require('../constants/routegroup');
const authModel = require('../models/auth.model');

const accessToAuthService = async (req, res, next) => {
	//check if the token is needed for the route being accessed
	if (!routes.unsecureRoutes.includes(req.path)) {
		const authHeader = req.headers['authorization'];

		let token;

		if (!authHeader) {
			return res.status(412).json({
				message: 'Access denied!!! Missing credentials',
			});
		}

		//separate the Bearer from the string if it exists
		const separateBearer = authHeader.split(' ');
		if (separateBearer.includes('Bearer')) {
			token = separateBearer[1];
		} else {
			token = authHeader;
		}

		try {
			const grantAccess = await jwt.verify(token, config.JWT_SECRET);
			req.app = grantAccess;

			//check for expiration
			if (Math.floor(Date.now() / 1000) <= req.app.exp) {
				next();
				return;
			} else {
				return res.status(403).json({
					message: 'Token has expired. you need to register for a new one',
				});
			}
		} catch (error) {
			console.log(`JWT verification error >>> ${error.message}`);
			res.status(403).json({
				message: 'Something went wrong. Please try again..',
			});
		}
	} else {
		next();
	}
};

const userToken = async (req, res, next) => {
	if (routes.secureAuthRoues.includes(req.path)) {
		const userToken = req.headers['user-token'];
		let decodedToken;

		if (!userToken) {
			return res.status(412).json({
				message: 'Access denied!!! Missing credentials',
			});
		}
		//separate the Bearer from the string if it exists
		const separateBearer = userToken.split(' ');
		if (separateBearer.includes('Bearer')) {
			decodedToken = separateBearer[1];
		} else {
			decodedToken = userToken;
		}

		try {
			const allowAccess = await jwt.verify(decodedToken, config.JWT_SECRET);

			if (allowAccess) {
				req.user = allowAccess;
				next();
				return;
			}
		} catch (error) {
			console.log(`JWT verification error >>> ${error.message}`);
			return res.status(403).json({
				message: 'Something went wrong. Please try again..',
			});
		}
	} else {
		next();
	}
};

module.exports = {
	accessToAuthService,
	userToken,
};
