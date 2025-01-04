const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1]
        console.log("Token recibido:", token)

        const validTokenPayload = jwt.verify(token, process.env.TOKEN_SECRET)

        req.payload = validTokenPayload
        console.log("Token verificado:", validTokenPayload)

        next()

    } catch (error) {
        res.status(401).json("token not provided or not valid");
    }
}

module.exports = verifyToken