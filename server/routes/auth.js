const express = require('express');
const { loginUser, signupUser, forgotPwd, resetPwd } = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgot-pwd', forgotPwd);
router.post('/reset-pwd', resetPwd);

module.exports = router;
