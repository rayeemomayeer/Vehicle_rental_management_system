import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/roleMiddleware";

const router = Router();

router.get("/api/v1/users", authMiddleware, isAdmin, UserController.getAllUsers);

router.put("/api/v1/users/:userId", authMiddleware, UserController.updateUser);

router.delete("/api/v1/users/:userId", authMiddleware, isAdmin,UserController.deleteUser);

export default router;