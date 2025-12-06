const express = require('express');
const router = express.Router();
const { getAllComercials, createComercial, updateComercial, deleteComercial } = require('../controllers/comercial.controllers');
const { validateComercial, validateComercialId } = require('../validators/comercial.validators');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', getAllComercials);
router.post('/', verifyToken, validateComercial, createComercial);
router.put('/:id', verifyToken, validateComercialId, validateComercial, updateComercial);
router.delete('/:id', verifyToken, validateComercialId, deleteComercial);

module.exports = router;