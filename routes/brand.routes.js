const express = require('express');
const router = express.Router();
const { getAllBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brand.controllers');

router.get('/', getAllBrands);
router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;