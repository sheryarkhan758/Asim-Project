const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const ctrl = require('../controllers/orderController.js');

const router = express.Router();

// All order routes require a valid JWT.
router.use(requireAuth);

router.post('/', ctrl.createOrder);
router.get('/', ctrl.getOrders);
router.get('/:id', ctrl.getOrder);

// Admin-only: advance order status.
router.put('/:id/status', requireAdmin, ctrl.updateOrderStatus);

module.exports = router;
