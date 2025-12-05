require("dotenv").config()
const express = require("express")
const app = express()

// Importar db pero no bloquear - Mongoose manejará la conexión
// Con bufferCommands: true, las queries se encolarán hasta que MongoDB esté listo
require("./db")

require("./config")(app)

require("./routes")(app)
require("./error-handling")(app)

module.exports = app
