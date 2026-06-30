const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');
const ctrl = require('../controllers/plantController.js');

const router = express.Router();

// Public reads. '/category/:id' is declared before '/:id' so "category"
// is not captured as a plant id.
router.get('/', ctrl.getAllPlants);
router.get('/category/:id', ctrl.getPlantsByCategory);
router.get('/:id', ctrl.getPlantById);

// Admin-only writes.
router.post('/', requireAuth, requireAdmin, ctrl.createPlant);
router.put('/:id', requireAuth, requireAdmin, ctrl.updatePlant);
router.delete('/:id', requireAuth, requireAdmin, ctrl.deletePlant);

module.exports = router;
