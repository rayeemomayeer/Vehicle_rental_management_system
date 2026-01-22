import { Router } from "express";
import { BookingController } from "./booking.controller";

const router = Router();

router.post("/api/v1/bookings", BookingController.createBooking);
router.get("/api/v1/bookings", BookingController.getBooking);
router.patch("/api/v1/bookings/:bookingId", BookingController.updateBooking);

export default router;