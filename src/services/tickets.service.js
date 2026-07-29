import db from "../config/db.js";
import { classifyTicketWithMistral } from "./ai.service.js";

async function createAndClassifyTicket({ customer_name, customer_email, is_enterprise, subject, message }) {
    // Check previous tickets count for this email
    let count = 0;
    if (customer_email) {
        const [rows] = await db.query("SELECT COUNT(*) as total FROM tickets WHERE customer_email = ?", [customer_email]);
        count = rows[0].total;
    }

    // Send only subject and message to AI (never send customer email)
    const aiData = await classifyTicketWithMistral({ subject, message });

    let priority = (aiData.priority || 'MEDIUM').toUpperCase();

    // Rule 1: Boost priority if customer is angry
    if (aiData.sentiment === 'Angry') {
        if (priority === 'LOW') priority = 'MEDIUM';
        else if (priority === 'MEDIUM') priority = 'HIGH';
        else if (priority === 'HIGH') priority = 'CRITICAL';
    }

    // Rule 2: Enterprise customer or >= 3 previous tickets -> minimum HIGH priority
    if (is_enterprise || count >= 3) {
        if (priority === 'LOW' || priority === 'MEDIUM') {
            priority = 'HIGH';
        }
    }

    // Rule 3: Abusive message -> no suggested reply
    let reply = aiData.suggested_reply;
    if (aiData.sentiment === 'Abusive') {
        reply = null;
    }

    // Save ticket to database
    const [result] = await db.query(
        "INSERT INTO tickets (customer_name, customer_email, subject, message, category, priority, suggested_reply, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN')",
        [customer_name || 'Anonymous', customer_email || null, subject, message, aiData.category || 'General', priority, reply]
    );

    const ticket = await getTicketById(result.insertId);
    return ticket;
}

async function getTicketById(id) {
    const [tickets] = await db.query("SELECT * FROM tickets WHERE id = ?", [id]);
    if (tickets.length === 0) return null;

    const [feedback] = await db.query("SELECT * FROM feedback WHERE ticket_id = ?", [id]);
    tickets[0].feedback = feedback[0] || null;
    return tickets[0];
}

async function getAllTickets({ category, priority }) {
    let sql = "SELECT * FROM tickets";
    let params = [];

    if (category && priority) {
        sql += " WHERE category = ? AND priority = ?";
        params = [category, priority.toUpperCase()];
    } else if (category) {
        sql += " WHERE category = ?";
        params = [category];
    } else if (priority) {
        sql += " WHERE priority = ?";
        params = [priority.toUpperCase()];
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await db.query(sql, params);
    return rows;
}

export { createAndClassifyTicket, getTicketById, getAllTickets };
