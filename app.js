require("dotenv").config()
require("./db")

const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require("./config")(app)

require("./routes")(app)
require("./error-handling")(app)

module.exports = app
