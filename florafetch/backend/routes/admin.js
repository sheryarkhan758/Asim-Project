const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const reviewCtrl = require('../controllers/reviewController.js');
const orderCtrl = require('../controllers/orderController.js');

const router = express.Router();

// Store-wide orders list for admins.
router.get('/orders', requireAuth, requireAdmin, orderCtrl.getAllOrders);

// Admin moderation queue: unapproved reviews.
router.get('/reviews', requireAuth, requireAdmin, reviewCtrl.getModerationQueue);

module.exports = router;
