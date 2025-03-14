import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export interface payload extends JwtPayload {
    userId: string;
}

export interface AuthenticatedRequest extends Request {
    user?: any
}