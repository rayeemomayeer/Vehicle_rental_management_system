import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";

const signup = async (name: string, email: string, password: string, phone: string, role: string) => {
    try {
        email = email.toLowerCase();
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) throw new Error("User with this email already exists");
        if (password.length < 6) throw new Error("Password must be at least 6 characters long");

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
            [name, email, hashedPassword, phone, role]
        );
        return result.rows[0];
    } finally {
        console.log("signup completed");
    }
}

const signin = async (email: string, password: string) => {
    try {
        email = email.toLowerCase();
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        if (!user) throw new Error("Invalid email or password");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid email or password");

        const token = jwt.sign(
            {id: user.id, role: user.role},
            config.jwtSecret as string,
            {expiresIn: "1d"}
        );
        return {token, user: {id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role}};
    } finally {
        console.log("signin completed");
    }
}

export const authService = {
    signup,
    signin,
}