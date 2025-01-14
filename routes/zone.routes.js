const express = require('express');
const router = express.Router();
const { getAllZones, createZone, updateZone, deleteZone } = require('../controllers/zone.controllers');

router.get('/', getAllZones);
router.post('/', createZone);
router.put('/:id', updateZone);
router.delete('/:id', deleteZone);

module.exports = router;