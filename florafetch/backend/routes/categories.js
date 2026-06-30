const express = require('express');
const ctrl = require('../controllers/categoryController.js');

const router = express.Router();

router.get('/', ctrl.getAllCategories);

module.exports = router;
