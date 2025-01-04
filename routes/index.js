module.exports = app => {

    const authRouter = require("./auth.routes")
    app.use("/api", authRouter)

    const saleRouter = require("./sale.routes")
    app.use("/api,", saleRouter)
}
