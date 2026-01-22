import express, { Request, Response } from 'express';
import cors from "cors";

import config from './config';
import initDB from './config/db';
import userRoutes from './modules/users/user.routes';
import vehicleRoutes from './modules/vehicles/vehicle.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors())
app.use(express.json());
app.use(errorHandler);
    
app.use(authRoutes);
app.use(userRoutes);
app.use(vehicleRoutes);
app.use(bookingRoutes);

initDB();

export default app;