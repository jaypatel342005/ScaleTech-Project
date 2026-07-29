import db from "../config/db.js";

async function createFeedback({ ticket_id, is_correct, comments }) {
    const [result] = await db.query(
        "INSERT INTO feedback (ticket_id, is_correct, comments) VALUES (?, ?, ?)",
        [ticket_id, is_correct, comments || null]
    );
    return result.insertId;
}

export { createFeedback };
