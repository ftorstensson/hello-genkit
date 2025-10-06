/*
 * Hello Genkit - Definitive Production Version v4.0 (Authoritative)
 * This version resolves the middleware paradox by removing the global
 * express.json() parser and relying on the expressHandler's internal,
 * Zod-aware parser. This is the production-safe, authoritative pattern.
 */

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import express from 'express';
import { expressHandler } from '@genkit-ai/express';

// --- Initialization ---
const ai = genkit({
  plugins: [googleAI()],
});

// --- Schema ---
const HelloSchema = z.object({
  name: z.string(),
});

// --- Flow ---
export const helloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: HelloSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    console.log('[helloFlow] Request received. Body:', input);
    return `Hello, ${input.name}!`;
  }
);

// --- Express Server Setup ---
const app = express();
const port = process.env.PORT || 8080;

// The global app.use(express.json()) has been removed to prevent
// the request stream from being consumed before reaching the Genkit handler.

// The expressHandler now manages its own body parsing.
app.post('/helloFlow', expressHandler(helloFlow));

// Health check for Cloud Run readiness probe.
app.get('/healthz', (req, res) => res.status(200).send('OK'));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});