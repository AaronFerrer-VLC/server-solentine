require("dotenv").config()
require("./db/index")

const express = require("express")
const app = express()

app.use(express.json()); // Asegúrate de que este middleware esté presente para parsear JSON
app.use(express.urlencoded({ extended: true }));

require("./config")(app)

require("./routes")(app)
require("./error-handling")(app)

module.exports = app
