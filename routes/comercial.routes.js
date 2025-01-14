const express = require('express');
const router = express.Router();
const { getAllComercials, createComercial, updateComercial, deleteComercial } = require('../controllers/comercial.controllers');

router.get('/', getAllComercials);
router.post('/', createComercial);
router.put('/:id', updateComercial);
router.delete('/:id', deleteComercial);

module.exports = router;