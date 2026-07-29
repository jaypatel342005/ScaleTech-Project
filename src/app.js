import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import ticketRouter from './routes/tickets.route.js';
import feedbackRouter from './routes/feedback.route.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Root endpoint: Returns full API route info and documentation
app.get('/', (req, res) => {
    res.json({
        name: "ScaleTech Project - Support Ticket Router API",
        status: "Online",
        deployed_url: "https://scale-tech-project.vercel.app",
        endpoints: [
            {
                method: "POST",
                path: "/tickets",
                description: "Create and classify a new support ticket using Mistral AI & business rules",
                sample_body: {
                    customer_name: "Amit Patel",
                    customer_email: "amit@example.com",
                    is_enterprise: false,
                    subject: "Forgot Password",
                    message: "I cannot login to my account."
                }
            },
            {
                method: "GET",
                path: "/tickets",
                description: "List all tickets with optional query filters",
                query_parameters: {
                    category: "Account | Billing | Delivery | Refund | Technical | General",
                    priority: "LOW | MEDIUM | HIGH | CRITICAL"
                },
                example: "GET /tickets?category=Billing&priority=HIGH"
            },
            {
                method: "GET",
                path: "/tickets/:id",
                description: "Retrieve single ticket details by ID",
                example: "GET /tickets/1"
            },
            {
                method: "POST",
                path: "/tickets/:id/feedback",
                description: "Record feedback on AI classification accuracy",
                sample_body: {
                    is_correct: true,
                    comments: "Classification was accurate."
                }
            }
        ]
    });
});

app.use("/tickets", ticketRouter);
app.use("/feedback", feedbackRouter);

export default app;
