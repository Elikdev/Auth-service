const router = require('express').Router();
const {signUp, verifyEmail, signIn} = require('../controllers/auth.controller');

router.post('/register', signUp);

module.exports = router;
