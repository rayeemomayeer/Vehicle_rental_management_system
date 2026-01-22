import { Router } from "express";
import { BookingController } from "./booking.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdminOrCustomer } from "../../middleware/roleMiddleware";

const router = Router();

router.post("/api/v1/bookings", authMiddleware, isAdminOrCustomer,BookingController.createBooking);
router.get("/api/v1/bookings", authMiddleware, isAdminOrCustomer,BookingController.getBooking);
router.put("/api/v1/bookings/:bookingId", authMiddleware, isAdminOrCustomer, BookingController.updateBooking);

export default router;