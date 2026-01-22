import { pool } from '../../config/db';

const autoReturnExpiredBookings = async () =>{
    try {
        const expiredBookings = await pool.query(
            `SELECT * FROM bookings WHERE status = "active" AND rent_end_date < CURRENT_DATE`
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
    }finally {
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
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
        );
        const booking = bookingResult.rows[0];

        await pool.query("UPDATE vehicles SET availability_status = 'booked' WHERE ID = $1", [vehicle_id]);

        return booking;
    } finally {
        console.log("booking completed")
    }
}

const getBooking = async (user: any) => {
    await autoReturnExpiredBookings();
    try {
        if (user.role === "admin") {
            const result = await pool.query(
                `SELECT b.*, u.name as customer_name, u.email as customer_email, v.vehicle_name, v.registration_number
           FROM bookings b
           JOIN users u ON b.customer_id = u.id
           JOIN vehicles v ON b.vehicle_id = v.id`
            );
            return result.rows;
        } else{
            const result = await pool.query(
                `SELECT b.*, u.name as customer_name, u.email as customer_email, v.vehicle_name, v.registration_number
           FROM bookings b
           JOIN users u ON b.customer_id = u.id
           JOIN vehicles v ON b.vehicle_id = v.id
           WHERE b.customer_id = $1`,
                [user.id]
            );
            return result.rows;
        }
    }finally {
        console.log("get booking completed");
    }
}

const updateBooking = async (bookingId: number, status: "cancelled" | "returned", user: any) => {
    try {
        const result = await pool.query("SELECT * FROM bookings WHERE ID = $1", [bookingId]);
        const booking = result.rows[0];
        if (!booking) throw new Error("Booking not found");

        if (status === "cancelled" && user.role === "customer") {
            if (new Date(booking.rent_start_date) <= new Date()) {
                throw new Error("Cannot cancel booking after start date");
            };
            await pool.query("UPDATE bookings SET status = 'cancelled' WHERE ID = $1", [bookingId]);
            await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE ID = $1", [booking.vehicle_id]);
        }
        if (status === "returned" && user.role === "admin") {
            await pool.query("UPDATE bookings SET status = 'returned' WHERE ID = $1", [bookingId]);
            await pool.query("UPDATE vehicles SET availability_status = 'available' WHERE ID = $1", [booking.vehicle_id]);
        }
        const updatedBookingResult = await pool.query("SELECT * FROM bookings WHERE ID = $1", [bookingId]);
        return updatedBookingResult.rows[0];

    } finally {
        console.log("booking update completed");
    }
}

export const bookingService = {
    createBooking,
    getBooking,
    updateBooking
}