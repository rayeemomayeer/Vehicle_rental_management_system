import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await VehicleService.createVehicle(req.body);
        res.status(201).json({ success: true, message: "Vehicle created successfully", data: vehicle });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const getAllVehicles = async (req: Request, res: Response) => {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      const message = vehicles.length > 0 ? "Vehicles retrieved successfully" : "No vehicles found";
      res.status(200).json({ success: true, message, data: vehicles });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }

}

const getVehicleById = async (req: Request, res: Response) => {
    try {
      const vehicle = await VehicleService.getVehicleById(Number(req.params.vehicleId));
      res.status(200).json({ success: true, message: "Vehicle retrieved successfully", data: vehicle });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }

}

const updateVehicle = async (req: Request, res: Response) => {
    try {
      const vehicle = await VehicleService.updateVehicle(Number(req.params.vehicleId), req.body);
      res.status(200).json({ success: true, message: "Vehicle updated successfully", data: vehicle });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }

}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
      const result = await VehicleService.deleteVehicle(Number(req.params.vehicleId));
      res.status(200).json({ success: true, message: result.message });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
}

export const VehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}