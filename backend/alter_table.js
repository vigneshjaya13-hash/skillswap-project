const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function alter() {
    console.log("Adding resource_link column to skills table...");
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT),
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: true }
        });
        
        await conn.query('ALTER TABLE skills ADD COLUMN resource_link VARCHAR(255) DEFAULT NULL;');
        console.log("Column resource_link added successfully!");
        await conn.end();
    } catch (e) {
        console.log("Error or already exists:", e.message);
    }
}
alter();
