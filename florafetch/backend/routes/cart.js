const express = require('express');
const { requireAuth } = require('../middleware/auth.js');
const ctrl = require('../controllers/cartController.js');

const router = express.Router();

// All cart routes require a valid JWT and operate on req.user only.
router.use(requireAuth);

router.get('/', ctrl.getCart);
router.post('/', ctrl.addToCart);
router.delete('/:itemId', ctrl.removeFromCart);

module.exports = router;
