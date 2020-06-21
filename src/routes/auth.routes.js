const router = require('express').Router();
const {
	registerForToken,
	signUp,
	signIn,
	checkStatus,
} = require('../controllers/auth.controller');
const {
	appRegistration,
	userSignUpValidationRules,
	userSignInValidationRules,
} = require('../helpers/userAuthRules');

router.post('/newapp', appRegistration(), registerForToken);

router.post('/register', userSignUpValidationRules(), signUp);

router.post('/login', userSignInValidationRules(), signIn);

router.get('/status', checkStatus);

module.exports = router;
