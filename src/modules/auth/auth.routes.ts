import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/api/v1/auth/signup", AuthController.signup);
router.post("/api/v1/auth/signin", AuthController.signin);

export default router;