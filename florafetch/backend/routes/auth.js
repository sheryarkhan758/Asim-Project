const express = require('express');
const { requireAuth } = require('../middleware/auth.js');
const ctrl = require('../controllers/authController.js');

const router = express.Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/logout', requireAuth, ctrl.logout);
router.get('/profile', requireAuth, ctrl.getProfile);
router.put('/profile', requireAuth, ctrl.updateProfile);

module.exports = router;
