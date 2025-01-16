require("dotenv").config()
require("./db")

const express = require("express")
const cors = require("cors")
const app = express()
const path = require("path")

const allowedOrigins = ['http://localhost:5173', 'https://solentine.netlify.app']

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

require("./config")(app)

require("./routes")(app)
require("./error-handling")(app)

module.exports = app
