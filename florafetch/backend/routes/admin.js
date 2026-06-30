const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const reviewCtrl = require('../controllers/reviewController.js');

const router = express.Router();

// Admin moderation queue: unapproved reviews.
router.get('/reviews', requireAuth, requireAdmin, reviewCtrl.getModerationQueue);

module.exports = router;
