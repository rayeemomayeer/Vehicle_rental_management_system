# 🚗 Vehicle Rental Management System

**Live URL:** [https://vehiclerental-c7sz1m9v2-rayeem-omayeers-projects.vercel.app/](https://vehiclerental-c7sz1m9v2-rayeem-omayeers-projects.vercel.app/)

---

## 📖 Overview
The **Vehicle Rental Management System** is a backend application designed to manage vehicle rentals with robust authentication, role-based access control, and booking workflows. It provides APIs for managing users, vehicles, and bookings, ensuring compliance with business rules such as preventing deletion of users with active bookings and automatically marking expired rentals as returned.

---

## ✨ Features
- **Authentication & Authorization**
  - Secure signup/signin with hashed passwords.
  - JWT-based authentication.
  - Role-based access control (`admin` vs `customer`).

- **User Management**
  - Admin can view all users.
  - Admin or user can update profile.
  - Admin can delete users (blocked if active bookings exist).

- **Vehicle Management**
  - Admin can create, update, and delete vehicles.
  - Public endpoints to view all vehicles or a specific vehicle.

- **Booking Management**
  - Customers can create bookings.
  - Admin can view all bookings; customers can view their own.
  - Bookings auto-return after `rent_end_date`.
  - Admin or customer can update/cancel bookings with rules enforced.

- **Validation & Constraints**
  - Database constraints for integrity (unique emails, valid roles, positive rent price).
  - Middleware validation for business rules (dates, password length, etc.).

- **Developer-Friendly**
  - Consistent API responses.
  - Modular folder structure.
  - Centralized error handling.

---

## 🛠️ Technology Stack
- **Node.js + TypeScript** — runtime and type safety.
- **Express.js** — web framework for building REST APIs.
- **PostgreSQL** — relational database with constraints and foreign keys.
- **bcrypt** — secure password hashing.
- **jsonwebtoken (JWT)** — authentication and authorization.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/vehicle-rental-management-system.git
cd vehicle-rental-management-system
```
### 2. Install Dependencies
```
npm install
```
### 3. Configure Environment Variables

Create a .env file in the project root:
```
DATABASE_URL=postgres://username:password@localhost:5432/vehiclerental
JWT_SECRET=your_jwt_secret
PORT=3000
```
### 4. Initialize Database

Tables (users, vehicles, bookings) are auto-created via initDB when the server starts.

### 5. Run the Application
```
npm run dev
```
Server will start at http://localhost:3000.

🚦 Usage Instructions



### Authentication

POST /api/v1/auth/signup → Register new user (admin or customer).

POST /api/v1/auth/signin → Login and receive JWT token.



### Users

GET /api/v1/users → Admin only: view all users.

PUT /api/v1/users/:id → Update user profile.

DELETE /api/v1/users/:id → Admin only: delete user.



### Vehicles

POST /api/v1/vehicles → Admin only: create vehicle.

GET /api/v1/vehicles → Public: view all vehicles.

GET /api/v1/vehicles/:id → Public: view vehicle by ID.

PUT /api/v1/vehicles/:id → Admin only: update vehicle.

DELETE /api/v1/vehicles/:id → Admin only: delete vehicle.



### Bookings

POST /api/v1/bookings → Customer/Admin: create booking.

GET /api/v1/bookings → Admin: all bookings; Customer: own bookings.

PUT /api/v1/bookings/:id → Update booking (cancel/return).



#### 📌 Notes

Use Postman or similar tools to test endpoints.

Always include Authorization: Bearer <token> header for protected routes.

Admin endpoints require an admin JWT token.


Developed by Rayeem.
