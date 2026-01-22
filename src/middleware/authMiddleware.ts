import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";


export const authMiddleware = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') return res.status(401).json({success: false, message: "No token provided"});

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({success: false, message: "No token provided"});

    try {
        const decoded = jwt.verify(token, config.jwtSecret as string) as {id: number, role: string};
        req.user = decoded;
        next();
    }catch (error: any) {
        return res.status(401).json({success: false, message: "Invalid token"});
    }
}