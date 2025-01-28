const express = require('express')
const User = require('../services/user')

const router = express.Router();

router.post('/register', User.create);
router.post('/login', User.authenticate)

module.exports = router
