import express from "express";
import { createNewFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/", createNewFeedback);

export default router;
