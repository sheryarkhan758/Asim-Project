const express = require('express');
const ctrl = require('../controllers/contactController.js');

const router = express.Router();

router.post('/', ctrl.createMessage);

module.exports = router;
