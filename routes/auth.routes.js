const {
    signupUser,
    loginUser,
    verifyUser

} = require("../controllers/auth.controllers.js")

const verifyToken = require("../middlewares/verifyToken.js")

const router = require("express").Router()


router.post('/signup', signupUser)

router.post('/login', loginUser)

router.get('/verify', verifyToken, verifyUser)

module.exports = router