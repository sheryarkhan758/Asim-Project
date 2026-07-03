const express = require('express');
const ctrl = require('../controllers/newsletterController.js');

const router = express.Router();

router.post('/', ctrl.subscribe);

module.exports = router;
