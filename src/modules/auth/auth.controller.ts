import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const user = await AuthService.signup(name, email, password, phone, role);

        res.status(201).json({
            success: true,
            message: "user registered successfully",
            data: user,
        })
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.signin(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const AuthController = {
    signup,
    signin
}