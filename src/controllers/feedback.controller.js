import { createFeedback } from "../services/feedback.service.js";

async function createNewFeedback(req, res) {
    try {
        const { ticket_id, is_correct, comments } = req.body;
        const id = await createFeedback({ ticket_id, is_correct, comments });
        res.status(201).json({ message: "Feedback submitted", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { createNewFeedback };
