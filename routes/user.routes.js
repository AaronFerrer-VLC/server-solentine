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

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.get('/users/', getAllUsers)
router.get('/users/detailed', getAllUsersPopulated)
router.get('/users/:id', getUser)
router.put('/users/:id', upload.single('avatar'), editUser)
router.delete('/users/:id', deleteUser)

router.get('/users/search/:querySearch', async (req, res, next) => {
    const { querySearch } = req.params;

    try {
        const response = await filterUsers(querySearch)
        res.json(response)
    } catch (error) {
        next(error)
    }
})

module.exports = router