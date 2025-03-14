import mongoose from "mongoose";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model";

import { HTTPError } from "../types";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction()

    try {

        const {
            name,
            email,
            password
        } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            const error = new HTTPError("User already exists", 409)
            throw error
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session })

        const expiresIn = Number(Bun.env.JWT_EXPIRES_IN || 86400);
        const token = jwt.sign({ userId: newUsers[0]?._id }, Bun.env.JWT_SECRET || "abcd", { expiresIn});

        await session.commitTransaction();
        session.endSession()

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0]
            }
        })

    } catch (error) {
        session.abortTransaction()
        session.endSession()
        next(error)
    }
}
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({
            email
        })

        if (!user) {
            const error = new HTTPError("User not found", 404)
            throw error
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            const error = new HTTPError("Invalid password", 401)
            throw error
        }

        const expiresIn = parseInt(Bun.env.JWT_EXPIRES_IN || "86400", 10);
        const token = jwt.sign({ userId: user?._id }, Bun.env.JWT_SECRET || "abcd", { expiresIn });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user
            }
        })

    } catch (error) {
        next(error)
    }
}
export const signOut = async (req: Request, res: Response, next: NextFunction) => {

}