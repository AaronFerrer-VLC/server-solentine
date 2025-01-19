const app = require("./app")

const PORT = process.env.PORT || 5005

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`)
})
