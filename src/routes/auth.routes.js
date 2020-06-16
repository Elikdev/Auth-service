const router = require('express').Router();
const {signUp, adminCheck, signIn} = require('../controllers/auth.controller');
const {
	userSignUpValidationRules,
	userSignInValidationRules,
} = require('../helpers/userAuthRules');

router.post('/register', userSignUpValidationRules(), signUp);

router.post('/login', userSignInValidationRules(), signIn);

//router.get('/admin', adminCheck);
module.exports = router;
