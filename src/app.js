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

app.use("/tickets", ticketRouter);
app.use("/feedback", feedbackRouter);

export default app;
