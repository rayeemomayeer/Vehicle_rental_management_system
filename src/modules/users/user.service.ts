import { pool } from "../../config/db"

const getAllUsers = async () => {
    try {
        const result = await pool.query("SELECT id, name, email, phone, role FROM users");
        return result.rows;
    } finally {
        console.log("get all users")
    }
}

const updateUser = async (userId: number, updates: any, requester: any) => {
    try {
        if (requester.role !== "admin" && requester.id !== userId) throw new Error("Unauthorized to update this user");

        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const key of ["name", "email", "phone", "role"]) {
            if (updates[key]){
                fields.push(`${key} = $${index}`);
                values.push(updates[key])
                index++;
            }
        }
        if (fields.length === 0) throw new Error("No valid fields to update");
        values.push(userId);

        const result = await pool.query(
            `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} RETURNING id, name, email, phone, role`,
            values
        )
        return result.rows[0];

     }finally {
        console.log("update user completed");
     }
}

const deleteUser = async (userId: number, requester: any) => {
    try {
        const bookingResult = await pool.query("SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'", [userId]);
        if (bookingResult.rows.length > 0) throw new Error("Cannot delete user with active bookings");
        await pool.query("DELETE FROM users WHERE id = $1", [userId]);
        return {message: "User deleted successfully"};
    } finally {
        console.log("delete user completed");
    }
}

export const UserService= {
    getAllUsers,
    updateUser,
    deleteUser
}