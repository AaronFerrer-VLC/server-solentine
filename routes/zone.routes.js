const express = require('express');
const router = express.Router();
const { getAllZones, createZone, updateZone, deleteZone } = require('../controllers/zone.controllers');
const { validateZone, validateZoneId } = require('../validators/zone.validators');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', getAllZones);
router.post('/', verifyToken, validateZone, createZone);
router.put('/:id', verifyToken, validateZoneId, validateZone, updateZone);
router.delete('/:id', verifyToken, validateZoneId, deleteZone);

module.exports = router;