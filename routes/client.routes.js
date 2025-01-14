const express = require('express');
const router = express.Router();
const { getAllClients, getClientByName, createClient, updateClient, deleteClient } = require('../controllers/client.controllers');

router.get('/', getAllClients);
router.get('/name/:name', getClientByName);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;