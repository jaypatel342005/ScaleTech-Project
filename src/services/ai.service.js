import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
dotenv.config();

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function classifyTicketWithMistral({ subject, message }) {
    const prompt = `Analyze this support ticket and return ONLY a JSON object:
{
  "category": "Account" or "Billing" or "Delivery" or "Refund" or "Technical" or "General",
  "sentiment": "Angry" or "Abusive" or "Neutral" or "Positive",
  "priority": "LOW" or "MEDIUM" or "HIGH" or "CRITICAL",
  "suggested_reply": "reply text"
}`;

    const response = await client.chat.complete({
        model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: `Subject: ${subject}\nMessage: ${message}` }
        ],
        responseFormat: { type: 'json_object' }
    });

    const data = JSON.parse(response.choices[0].message.content);
    return data;
}
