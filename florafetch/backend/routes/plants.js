const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const upload = require('../middleware/upload.js');
const ctrl = require('../controllers/plantController.js');

const router = express.Router();

// Wrap multer so upload errors (non-image, >2MB) return a clean 400 JSON.
// On error we drain the remaining request body to avoid an ECONNRESET.
// Optional multipart field name: "image" (JSON bodies with image_url still work).
function imageUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    req.resume();
    const status = err.status || (err.name === 'MulterError' ? 400 : 500);
    res.status(status).json({ error: err.message });
  });
}

// Public reads. '/category/:id' is declared before '/:id' so "category"
// is not captured as a plant id.
router.get('/', ctrl.getAllPlants);
router.get('/category/:id', ctrl.getPlantsByCategory);
router.get('/:id', ctrl.getPlantById);

// Admin-only writes. Auth is checked before the file is stored.
router.post('/', requireAuth, requireAdmin, imageUpload, ctrl.createPlant);
router.put('/:id', requireAuth, requireAdmin, imageUpload, ctrl.updatePlant);
router.delete('/:id', requireAuth, requireAdmin, ctrl.deletePlant);

module.exports = router;
