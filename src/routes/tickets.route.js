import express from "express";
import { createNewTicket, getTickets, getTicket, createTicketFeedback } from "../controllers/tickets.controller.js";

const router = express.Router();

router.post("/", createNewTicket);
router.get("/", getTickets);
router.get("/:id", getTicket);
router.post("/:id/feedback", createTicketFeedback);

export default router;
