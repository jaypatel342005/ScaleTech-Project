import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'support_ticket_router',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 4000,
    ssl: {
        rejectUnauthorized: true
    }
});

export default db;
