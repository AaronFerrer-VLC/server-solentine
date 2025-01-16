require("dotenv").config()
require("./db")

const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
    origin: function (origin, callback) {
        if (process.env.NODE_ENV === 'production') {
            callback(null, 'https://solentine.netlify.app')
        } else {
            callback(null, 'http://localhost:5173')
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions))

require("./config")(app)
require("./routes")(app)
require("./error-handling")(app)

module.exports = app

