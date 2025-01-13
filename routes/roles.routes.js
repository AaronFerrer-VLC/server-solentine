const express = require('express')
const router = express.Router()
const {
    getRoles,
    getOneRole,
    saveRole,
    editRole,
    deleteRole } = require('../controllers/roles.controllers')

router.get('/', getRoles)

module.exports = router