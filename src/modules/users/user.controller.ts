import { Request, Response } from "express";
import { UserService } from "./user.service"

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({ success: true, message: "Users retrieved successfully", data: users });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const updateUser = await UserService.updateUser(Number(req.params.userId), req.body, req.user);
        res.status(200).json({ success: true, message: "User updated successfully", data: updateUser });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const result = await UserService.deleteUser(userId, req.user);
        res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const UserController = {
    getAllUsers,
    updateUser,
    deleteUser
}