const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '2007Selv@',
    database: process.env.DB_NAME || 'skillswap',
});

async function runSeed() {
    try {
        console.log("Checking and altering skills table to support resources...");
        try {
            await pool.query("ALTER TABLE skills ADD COLUMN resource_link VARCHAR(500) DEFAULT NULL;");
        } catch(e) {
            console.log("Column resource_link likely exists already.");
        }

        console.log("Seeding default power-users...");
        const users = ['SystemAdmin', 'ProCoder', 'DesignGuru', 'LanguageExpert', 'DataNerd'];
        const userIds = [];
        for (const u of users) {
            try {
                const [res] = await pool.query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, 'password123')", [u, `${u.toLowerCase()}@example.com`]);
                userIds.push(res.insertId);
            } catch(e) {
                // If exists, get the ID
                const [existing] = await pool.query("SELECT id FROM users WHERE username = ?", [u]);
                if (existing.length > 0) userIds.push(existing[0].id);
            }
        }

        // Avoid duplicate seeding running amok if they run it twice
        await pool.query("DELETE FROM skills WHERE user_id IN (?)", [userIds]);

        console.log("Seeding massive database content with downloadable/viewable materials...");
        const skillsData = [
            // Offered Skills with Links
            { user_id: userIds[1], name: 'Full-Stack Next.js Mastery', description: 'Learn React, Next.js, and API routes. I uploaded a complete guide repository!', category: 'Development', type: 'offered', resource: 'https://nextjs.org/learn' },
            { user_id: userIds[2], name: 'Figma to Code', description: 'Detailed guide on turning Figma designs into CSS and Tailwind.', category: 'Design', type: 'offered', resource: 'https://figma.com/resources' },
            { user_id: userIds[3], name: 'Spanish A1 to B2', description: 'A massive collection of Spanish grammar worksheets. Available instantly here:', category: 'Languages', type: 'offered', resource: 'https://studyspanish.com' },
            { user_id: userIds[4], name: 'Intro to Machine Learning', description: 'Jupyter notebooks and datasets for ML beginners.', category: 'Data Science', type: 'offered', resource: 'https://kaggle.com/learn' },
            { user_id: userIds[0], name: 'Advanced Docker & Kubernetes', description: 'Containerize any web application securely with my official Docker compose templates.', category: 'Development', type: 'offered', resource: 'https://docker.com/101' },
            { user_id: userIds[1], name: 'Mastering Git & GitHub', description: 'The absolute best cheat sheet for branching, merging, and resolving conflicts.', category: 'Development', type: 'offered', resource: 'https://docs.github.com/en' },
            { user_id: userIds[2], name: 'Typography 101', description: 'Understanding kerning, leading, and font pairing for premium websites.', category: 'Design', type: 'offered', resource: 'https://fonts.google.com/knowledge' },
            { user_id: userIds[4], name: 'SQL Query Optimization', description: 'How to use indexing and EXPLAIN plans to speed up your database queries 100x.', category: 'Data Science', type: 'offered', resource: 'https://dev.mysql.com/doc/refman/8.0/en/optimization.html' },
            
            // Requested Skills (Usually don't have resources since they want to learn, but they can link a syllabus)
            { user_id: userIds[1], name: 'Advanced Rust / Solidity', description: 'I want to learn how to build Web3 smart contracts. Here is the syllabus I am trying to follow:', category: 'Development', type: 'requested', resource: 'https://docs.soliditylang.org/' },
            { user_id: userIds[3], name: 'Japanese Pronunciation', description: 'Need a native speaker to help me practice my pitch accent.', category: 'Languages', type: 'requested', resource: null },
            { user_id: userIds[0], name: 'Cybersecurity Basics', description: 'Looking for a baseline introduction to network sec and Wireshark.', category: 'Other', type: 'requested', resource: null },
            { user_id: userIds[2], name: 'Adobe After Effects', description: 'Need someone to show me how to use mask tracking correctly.', category: 'Design', type: 'requested', resource: null },
            
            // More Offerings
            { user_id: userIds[4], name: 'Python Automation Scripts', description: 'I uploaded my 5 best scripts for automating Excel and Email tasks.', category: 'Data Science', type: 'offered', resource: 'https://automatetheboringstuff.com/' },
            { user_id: userIds[3], name: 'Public Speaking Confidence', description: 'A workbook and video series overcoming stage fright.', category: 'Soft Skills', type: 'offered', resource: 'https://www.toastmasters.org/resources' },
            { user_id: userIds[1], name: 'Node.js Express Security', description: 'Learn how to prevent SQL injection and set up CORS correctly.', category: 'Development', type: 'offered', resource: 'https://expressjs.com/en/advanced/best-practice-security.html' },
            { user_id: userIds[0], name: 'Linux Server Administration', description: 'My personal bash script collection and administration handbook.', category: 'Development', type: 'offered', resource: 'https://ubuntu.com/tutorials' },
            { user_id: userIds[2], name: 'Color Theory in Practice', description: 'Upload of the color palette workbook I created for new designers.', category: 'Design', type: 'offered', resource: 'https://color.adobe.com/create/color-wheel' },
            { user_id: userIds[4], name: 'Data Visualization with Tableau', description: 'A comprehensive starter dashboard you can download right now to practice.', category: 'Data Science', type: 'offered', resource: 'https://public.tableau.com/en-us/s/resources' }
        ];

        for(const skill of skillsData) {
             await pool.query("INSERT INTO skills (user_id, name, description, category, type, resource_link) VALUES (?, ?, ?, ?, ?, ?)", 
                 [skill.user_id, skill.name, skill.description, skill.category, skill.type, skill.resource || null]);
        }

        console.log(`✅ Success! Inserted ${skillsData.length} advanced contents with upload files into the database.`);
        process.exit(0);
    } catch(e) {
        console.error("Seed Failed:", e);
        process.exit(1);
    }
}
runSeed();
