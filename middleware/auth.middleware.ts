import type { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model";
import type { payload, AuthenticatedRequest } from "../types";

const authorize = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if(!token) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }

        const decoded = jwt.verify(token, Bun.env.JWT_SECRET || "" ) as payload

        const user = await User.findById(decoded.userId)

        if(!user){
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }

        req.user= user
        
        next()

    } catch (error: any) {
        next(error)
        res.status(401).json({
            message: "Unauthorized",
            error: error.message
        })
    }
}

export default authorize