import express from "express"

import cookieParser from "cookie-parser"

import { authRouter, subscriptionRouter, userRouter, workflowRouter } from "./routes"
import connecToDatabase from "./database/mongodb"
import errorMiddleware from "./middleware/error.middlware"
const app = express()
const port = Bun.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/workflows", workflowRouter)

app.use(errorMiddleware)

app.get("/", (req, res) => {
    res.send("welcome to subdub api")
})

app.listen(port, async () => {
    console.log(`Server started at http://localhost:${port}`)
    await connecToDatabase()
})