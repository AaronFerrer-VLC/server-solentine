const app = require("./app")

const PORT = process.env.PORT || 5005
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`)
})
