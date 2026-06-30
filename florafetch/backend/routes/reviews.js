const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const upload = require('../middleware/upload.js');
const ctrl = require('../controllers/reviewController.js');

const router = express.Router();

// Wrap multer so upload errors (non-image, >2MB) return a clean 400 JSON.
// On error we drain the remaining request body to avoid an ECONNRESET that
// would otherwise abort the response mid-upload.
function photoUpload(req, res, next) {
  upload.single('photo')(req, res, (err) => {
    if (!err) return next();
    req.resume();
    const status = err.status || (err.name === 'MulterError' ? 400 : 500);
    res.status(status).json({ error: err.message });
  });
}

// Public: approved reviews for a plant.
router.get('/plant/:plantId', ctrl.getPlantReviews);

// JWT: submit a review with an optional photo (multipart field name: "photo").
router.post('/', requireAuth, photoUpload, ctrl.createReview);

// Admin: approve a review.
router.put('/:id/approve', requireAuth, requireAdmin, ctrl.approveReview);

module.exports = router;
