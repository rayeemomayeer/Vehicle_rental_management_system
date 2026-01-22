import config  from ".";
import {Pool} from "pg";

export const pool = new Pool({
    connectionString: `${config.DATABASE_URL}`,
})

const initDB = async () => {
    await pool.query(``);
}

export default initDB;