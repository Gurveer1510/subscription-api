import { Router } from "express";
import { getUserById, getUsers } from "../controllers/user.controller";
import authorize from "../middleware/auth.middleware";

const userRouter = Router()

userRouter.get("/", getUsers)

userRouter.get("/:id", authorize, getUserById)

userRouter.post("/", (req, res) => {
    res.send("CREATE new user")
})
userRouter.put("/:id", (req, res) => {
    res.send("UPDATE user route")
})
userRouter.delete("/:id", (req, res) => {
    res.send("DELETE user route")
})

export default userRouter