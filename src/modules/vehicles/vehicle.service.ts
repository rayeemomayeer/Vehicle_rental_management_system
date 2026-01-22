import { pool } from "../../config/db";

const createVehicle = async (vehicleData: any) => {
    try {
        const {vehicle_name, registration_number, type, daily_rent_price, availability_status} = vehicleData;

        const existing = await pool.query("SELECT * FROM vehicles WHERE registration_number = $1", [registration_number]);
        if (existing.rows.length > 0) throw new Error("Vehicle with this registration number already exists");

        const result  = await pool.query(
            `INSERT INTO vehicles (vehicle_name, registration_number, type, daily_rent_price, availability_status)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [vehicle_name, registration_number, type, daily_rent_price, availability_status]
        );
        return result.rows[0];
    } finally {
        console.log("create vehicle completed");
    }
}

const getAllVehicles = async () => {
    try {
        const result = await pool.query("SELECT * FROM vehicles");
        return result.rows;
    } finally {
        console.log("get all vehicles");
    }
}

const getVehicleById = async (vehicleId: number) => {
    try {
        const res = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicleId]);
      if (res.rows.length === 0) throw new Error("Vehicle not found");
      return res.rows[0];
    } finally {
        console.log("get vehicle by id completed");
    }
}

const updateVehicle = async (vehicleId: number, updates: any) => {
    try {
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const key of ["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"]) {
        if (updates[key]) {
          fields.push(`${key} = $${index}`);
          values.push(updates[key]);
          index++;
        }
      }

      if (fields.length === 0) throw new Error("No valid fields to update");

      values.push(vehicleId);

      const res = await pool.query(
        `UPDATE vehicles SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
        values
      );

      if (res.rows.length === 0) throw new Error("Vehicle not found");
      return res.rows[0];

    }finally {
        console.log("update vehicle completed");
    }
}

const deleteVehicle = async (vehicleId: number) => {
    try {
      const bookingResult = await pool.query(
        "SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'",
        [vehicleId]
      );
      if (bookingResult.rows.length > 0) {
        throw new Error("Cannot delete vehicle with active bookings");
      }

      const result = await pool.query("DELETE FROM vehicles WHERE id = $1 RETURNING *", [vehicleId]);
      if (result.rows.length === 0) throw new Error("Vehicle not found");

      return { message: "Vehicle deleted successfully" };
    } finally {
        console.log("delete vehicle completed");
    }
}

export const VehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
}