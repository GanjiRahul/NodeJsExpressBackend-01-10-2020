const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/user.cont');

router.post('/userSignIn' , userAuthController.userSignIn);

module.exports = router;