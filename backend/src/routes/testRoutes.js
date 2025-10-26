const express = require('express');
const router = express.Router();
const { sayHello } = require('../controllers/testController');

router.get('/salute', sayHello);

module.exports = router;
