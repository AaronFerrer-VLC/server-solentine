module.exports = app => {

    const authRouter = require("./auth.routes")
    app.use("/api/auth", authRouter)

    const saleRouter = require("./sale.routes")
    app.use("/api", saleRouter)

    const userRouter = require("./user.routes")
    app.use("/api", userRouter)

    const rolesRouter = require("./roles.routes")
    app.use("/api/roles", rolesRouter)

    const uploadRouter = require("./upload.routes")
    app.use("/api/upload", uploadRouter)
}
