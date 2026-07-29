import { createAndClassifyTicket, getTicketById, getAllTickets } from "../services/tickets.service.js";
import { createFeedback } from "../services/feedback.service.js";

async function createNewTicket(req, res) {
    try {
        const { customer_name, customer_email, is_enterprise, subject, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ error: "Subject and message are required" });
        }

        const ticket = await createAndClassifyTicket({ customer_name, customer_email, is_enterprise, subject, message });
        res.status(201).json({ message: "Ticket created", ticket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getTickets(req, res) {
    try {
        const { category, priority } = req.query;
        const tickets = await getAllTickets({ category, priority });
        res.json({ tickets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getTicket(req, res) {
    try {
        const ticket = await getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        res.json({ ticket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createTicketFeedback(req, res) {
    try {
        const { is_correct, comments } = req.body;
        const ticket_id = req.params.id;

        const ticket = await getTicketById(ticket_id);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        const feedbackId = await createFeedback({ ticket_id, is_correct, comments });
        res.status(201).json({ message: "Feedback submitted", id: feedbackId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { createNewTicket, getTickets, getTicket, createTicketFeedback };
