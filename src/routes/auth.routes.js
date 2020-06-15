const router = require('express').Router();
const {signUp, verifyEmail, signIn} = require('../controllers/auth.controller');

router.post('/register', signUp);

router.post('/login', signIn);

module.exports = router;
