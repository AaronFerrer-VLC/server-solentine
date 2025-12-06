const express = require('express');
const router = express.Router();
const { getAllClients, getClientByName, createClient, updateClient, deleteClient } = require('../controllers/client.controllers');
const { validateClient, validateClientId, validateClientName } = require('../validators/client.validators');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', getAllClients);
router.get('/name/:name', validateClientName, getClientByName);
router.post('/', verifyToken, validateClient, createClient);
router.put('/:id', verifyToken, validateClientId, validateClient, updateClient);
router.delete('/:id', verifyToken, validateClientId, deleteClient);

module.exports = router;