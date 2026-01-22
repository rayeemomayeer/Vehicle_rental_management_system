import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
        const booking = await bookingService.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date);
        res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const getBooking = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getBooking(req.user);
        res.status(200).json({ success: true, message: "Bookings retrieved successfully", data: bookings });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
}

const updateBooking = async (req: Request, res: Response) => {
    try {
        const {status} = req.body;
        const booking = await bookingService.updateBooking(Number(req.params.bookingId), status, req.user);
        res.status(200).json({ success: true, message: `Booking  ${status} updated successfully`, data: booking });
    }catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
}

export const BookingController = {
    createBooking,
    getBooking,
    updateBooking
}