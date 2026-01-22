import { pool } from '../../config/db';

const autoReturnExpiredBookings = async () => {
    try {
        const expiredBookings = await pool.query(
            `SELECT * FROM bookings WHERE status = 'active' AND rent_end_date < CURRENT_DATE`
        );

        for (const booking of expiredBookings.rows) {
            await pool.query(
                `UPDATE bookings SET status = 'returned' WHERE ID = $1`,
                [booking.id]
            );
            await pool.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE ID = $1`,
                [booking.vehicle_id]
            )
        }
    } finally {
        console.log("auto return check completed");
    }
}

const createBooking = async (customer_id: number, vehicle_id: number, rent_start_date: string, rent_end_date: string) => {
    try {
        const vehicles = await pool.query("SELECT * FROM vehicles WHERE ID = $1", [vehicle_id]);
        const vehicle = vehicles.rows[0];
        if (!vehicle) throw new Error('vehicle not found');
        if (vehicle.availability_status !== 'available') throw new Error('vehicle not available for booking');

        const start = new Date(rent_start_date);
        const end = new Date(rent_end_date);
        if (end <= start) throw new Error('End date must be after start date');

        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const total_price = vehicle.daily_rent_price * days;

        const bookingResult = await pool.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, "active"]
        );
        const booking = bookingResult.rows[0];

        await pool.query("UPDATE vehicles SET availability_status = 'booked' WHERE ID = $1", [vehicle_id]);

        return {
            id: booking.id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
            rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
            total_price: Number(booking.total_price),
            status: booking.status,
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: Number(vehicle.daily_rent_price),
            }
        }

    } finally {
        console.log("booking completed")
    }
}

const getBooking = async (user: any) => {
  await autoReturnExpiredBookings();
  try {
    let result;
    if (user.role === "admin") {
      result = await pool.query(`
        SELECT b.*, u.name as customer_name, u.email as customer_email,
               v.vehicle_name, v.registration_number
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
      `);

      const bookings = result.rows.map((row) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date.toISOString().split("T")[0],
        rent_end_date: row.rent_end_date.toISOString().split("T")[0],
        total_price: Number(row.total_price),
        status: row.status,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
        },
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      }));

      return {message: "Bookings retrieved successfully", data: bookings };
    } else {
      result = await pool.query(`
        SELECT b.*, v.vehicle_name, v.registration_number, v.type
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
      `, [user.id]);

      const bookings = result.rows.map((row) => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date.toISOString().split("T")[0],
        rent_end_date: row.rent_end_date.toISOString().split("T")[0],
        total_price: Number(row.total_price),
        status: row.status,
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      }));

      return {message: "Your bookings retrieved successfully", data: bookings };
    }
  } finally {
    console.log("get booking completed");
  }
};

const updateBooking = async (bookingId: number, status: "cancelled" | "returned", user: any) => {
    try {
        const result = await pool.query("SELECT * FROM bookings WHERE ID = $1", [bookingId]);
        const booking = result.rows[0];
        if (!booking) throw new Error("Booking not found");

        if (status === "cancelled") {
            if (user.role !== "customer") throw new Error("Only customers can cancel bookings");
            if (new Date(booking.rent_start_date) <= new Date()) {
                throw new Error("Cannot cancel booking after start date");
            };
            await pool.query("UPDATE bookings SET status = 'cancelled' WHERE ID = $1", [bookingId]);
            await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE ID = $1", [booking.vehicle_id]);
        } else if (status === "returned") {
            if (user.role !== "admin") throw new Error("Only admins can mark bookings as returned");
            await pool.query("UPDATE bookings SET status = 'returned' WHERE ID = $1", [bookingId]);
            await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE ID = $1", [booking.vehicle_id]);
        } else {
            throw new Error("Invalid status");
        }
        const updatedBookingResult = await pool.query("SELECT * FROM bookings WHERE ID = $1", [bookingId]);
        const updatedBooking = updatedBookingResult.rows[0];
        return { booking: updatedBooking, vehicle: { availability_status: 'available' } };

    } finally {
        console.log("booking update completed");
    }
}

export const bookingService = {
    createBooking,
    getBooking,
    updateBooking
}