const express = require('express');
const router = express.Router();
const { getAllBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brand.controllers');
const { validateBrand, validateBrandId } = require('../validators/brand.validators');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', getAllBrands);
router.post('/', verifyToken, validateBrand, createBrand);
router.put('/:id', verifyToken, validateBrandId, validateBrand, updateBrand);
router.delete('/:id', verifyToken, validateBrandId, deleteBrand);

module.exports = router;