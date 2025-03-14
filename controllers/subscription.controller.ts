import type { NextFunction, Request, Response } from "express";
import Subscription from "../models/subscription.model";
import { HTTPError, type AuthenticatedRequest } from "../types";
import User from "../models/user.model";
import { workflowClient } from "../config/upstash.config";

export const createSubsciption = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        })

        await workflowClient.trigger({
            url: `${Bun.env.SERVER_URL}`
        })

        res.status(201).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error)
    }
}

export const getUserSubscriptions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if(req.user.id !== req.params.id) {
            const error = new HTTPError('You are not the owner of this account', 401);
            throw error;
          }
      
          const subscriptions = await Subscription.find({ user: req.params.id });
      
          res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error)
    }
}