import type { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { HTTPError, type AuthenticatedRequest } from "../types";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().select("-password")

        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            const error = new HTTPError("User not found", 404)
            throw error
        }

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    }
}