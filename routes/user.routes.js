const express = require('express')
const multer = require('multer')
const {
    getAllUsers,
    getAllUsersPopulated,
    getUser,
    editUser,
    filterUsers,
    deleteUser
} = require('../controllers/user.controllers')
const { validateUserUpdate, validateUserId, validateUserQuery, validateSearchQuery } = require('../validators/user.validators')
const verifyToken = require('../middlewares/verifyToken')

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/users/', validateUserQuery, getAllUsers)
router.get('/users/detailed', getAllUsersPopulated)
router.get('/users/:id', validateUserId, getUser)
router.put('/users/:id', verifyToken, validateUserId, upload.single('avatar'), validateUserUpdate, editUser)
router.delete('/users/:id', verifyToken, validateUserId, deleteUser)

router.get('/users/search/:querySearch', validateSearchQuery, async (req, res, next) => {
    const { querySearch } = req.params;

    try {
        const response = await filterUsers(querySearch)
        res.json(response)
    } catch (error) {
        next(error)
    }
})

module.exports = router