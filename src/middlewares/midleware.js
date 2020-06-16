const jwt = require('jsonwebtoken');
const config = require('../configs/index');
const routes = require('../constants/routegroup');
const authModel = require('../models/auth.model');
const Role = require('../models/role.model');

const tokenCheck = (req, res, next) => {
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
			const grantAccess = jwt.verify(token, config.JWT_SECRET);
			req.user = grantAccess;
			next();
			return;
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

const isAdmin = async (req, res, next) => {
	try {
		if (routes.adminOnlyRoutes.includes(req.path)) {
			if (req.user) {
				id = req.user.userId;
				const userInfo = await authModel.findById(id);

				if (userInfo) {
					const checkRole = await Role.findOne({
						_id: userInfo.user_details.role,
					});

					if (checkRole.name == 'admin') {
						next();
						return;
					} else {
						return res.status(403).json({
							message: 'Access denied... require admin role',
						});
					}
				}
			}
		} else {
			next();
		}
	} catch (error) {
		console.log(`Error in authorization >>> ${error.message}`);
		res.status(500).json({
			message: 'Something went wrong. Please try again...',
		});
	}
};

module.exports = {
	tokenCheck,
	isAdmin,
};
