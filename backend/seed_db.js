const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function seed() {
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT),
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: true }
    };

    console.log("Connecting to TiDB Cloud...");
    const conn = await mysql.createConnection(config);
    
    // Create users if not exist
    await conn.execute(`INSERT IGNORE INTO users (id, username, email, password_hash) VALUES 
        (1, 'AliceTech', 'alice@skillswap.com', 'hash'),
        (2, 'BobDesign', 'bob@skillswap.com', 'hash'),
        (3, 'CharlieCode', 'charlie@skillswap.com', 'hash')
    `);

    // Insert mock skills
    await conn.execute(`INSERT INTO skills (user_id, name, description, category, type) VALUES 
        (1, 'Advanced React Patterns', 'I offer comprehensive React training! Learn hooks and states.', 'Development', 'offered'),
        (2, 'Figma UI Basics', 'Looking to learn how to design better UIs for my frontend.', 'Design', 'requested'),
        (3, 'Node.js Microservices', 'Let me teach you backend load balancing and queues.', 'Development', 'offered'),
        (1, 'Public Speaking 101', 'I want someone to help me practice my soft skills!', 'Soft Skills', 'requested')
    `);

    console.log("Database seeded successfully with test data!");
    await conn.end();
}

seed().catch(console.error);
