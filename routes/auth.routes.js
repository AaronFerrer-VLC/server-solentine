const {
    signupUser,
    loginUser,
    verifyUser
} = require("../controllers/auth.controllers.js")

const verifyToken = require("../middlewares/verifyToken.js")
const { validateSignup, validateLogin } = require("../validators/auth.validators.js")
const { authLimiter } = require("../middlewares/rateLimiter.js")

const router = require("express").Router()

// Apply rate limiting to auth routes
router.post('/signup', authLimiter, validateSignup, signupUser)
router.post('/login', authLimiter, validateLogin, loginUser)
router.get('/verify', verifyToken, verifyUser)

module.exports = router