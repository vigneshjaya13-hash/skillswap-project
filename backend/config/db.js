const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Initial connection to create the database if it doesn't exist
const initialPool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
});

async function initializeDatabase() {
    try {
        const initSqlPath = path.join(__dirname, '..', 'init.sql');
        const initSql = fs.readFileSync(initSqlPath, 'utf8');
        const statements = initSql.split(';').filter((stmt) => stmt.trim() !== '');

        for (const stmt of statements) {
            if (stmt.trim()) {
                await initialPool.query(stmt);
            }
        }
        console.log('✅ Database initialized successfully.');
    } catch (error) {
        console.error('❌ Failed to initialize database. Ensure MySQL is running on port 3306 without a root password, or check the .env file:', error.message);
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'skillswap',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = { pool, initializeDatabase };
