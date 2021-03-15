const express = require('express');
const router = express.Router();
const authModel = require('../models/author.model')
/* POST */
router.post('/login', authModel.validateUser);
router.post('/signUp',authModel.signUp)

module.exports = router;