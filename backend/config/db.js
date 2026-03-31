const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    database: process.env.DB_NAME || 'skillswap',
    ssl: process.env.DB_SSL ? { rejectUnauthorized: true } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Start a generalized pool
const pool = mysql.createPool(dbConfig);

async function initializeDatabase() {
    try {
        const initSqlPath = path.join(__dirname, '..', 'init.sql');
        const initSql = fs.readFileSync(initSqlPath, 'utf8');
        const statements = initSql.split(';').filter((stmt) => stmt.trim() !== '');

        for (const stmt of statements) {
            if (stmt.trim()) {
                await pool.query(stmt);
            }
        }
        console.log('✅ Remote TiDB Cloud Database initialized successfully.');
    } catch (error) {
        console.error('❌ Failed to initialize remote database:', error.message);
    }
}

module.exports = { pool, initializeDatabase };
