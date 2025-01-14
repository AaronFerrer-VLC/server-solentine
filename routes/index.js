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

    const zoneRouter = require("./zone.routes")
    app.use("/api/zones", zoneRouter)

    const brandRouter = require("./brand.routes")
    app.use("/api/brands", brandRouter)

    const clientRouter = require("./client.routes")
    app.use("/api/clients", clientRouter)

    const comercialRouter = require("./comercial.routes")
    app.use("/api/comercials", comercialRouter)
}
