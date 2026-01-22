import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/roleMiddleware";

const router = Router();

router.post("/api/v1/vehicles", authMiddleware, isAdmin, VehicleController.createVehicle);
router.put("/api/v1/vehicles/:vehicleId", authMiddleware, isAdmin, VehicleController.updateVehicle);
router.delete("/api/v1/vehicles/:vehicleId", authMiddleware, isAdmin, VehicleController.deleteVehicle);

router.get("/api/v1/vehicles", VehicleController.getAllVehicles);
router.get("/api/v1/vehicles/:vehicleId", VehicleController.getVehicleById);


export default router;