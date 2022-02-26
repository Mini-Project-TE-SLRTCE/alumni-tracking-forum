const express = require('express');
const { loginUser, signupUser, forgotPwd } = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgot-pwd', forgotPwd);

module.exports = router;
