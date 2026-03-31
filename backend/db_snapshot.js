const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

async function takeSnapshot() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        let output = '## MySQL Database Snapshot\n\n';

        const tables = ['users', 'skills', 'swaps'];
        
        for (const table of tables) {
            output += (`### Table: \`${table}\`\n`);
            try {
                const [rows] = await connection.execute(`SELECT * FROM ${table}`);
                
                if (rows.length === 0) {
                    output += ('> (Table is empty)\n\n');
                    continue;
                }

                const header = Object.keys(rows[0]);
                output += ('| ' + header.join(' | ') + ' |\n');
                output += ('| ' + header.map(() => '---').join(' | ') + ' |\n');

                for (const row of rows) {
                    const values = header.map(h => {
                        const val = row[h];
                        if (val instanceof Date) return val.toISOString();
                        return val === null ? 'NULL' : String(val).replace(/\|/g, '\\|');
                    });
                    output += ('| ' + values.join(' | ') + ' |\n');
                }
                output += '\n';
            } catch(e) {
                 output += ('> Error: ' + e.message + '\n\n');
            }
        }
        
        await connection.end();
        fs.writeFileSync('../db_snapshot_utf8.md', output, 'utf8');
        console.log('Saved to ../db_snapshot_utf8.md');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

takeSnapshot();
