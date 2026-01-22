import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
  }
  next();
}

export function isCustomer(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "customer") {
    return res.status(403).json({ success: false, message: "Forbidden: Customers only" });
  }
  next();
}

export function isAdminOrCustomer(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.role) {
    return res.status(403).json({ success: false, message: "Forbidden: Invalid role" });
  }
  next();
}