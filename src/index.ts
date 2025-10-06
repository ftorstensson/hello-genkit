/*
 * Hello Genkit - Definitive Production Version v5.0 (Authoritative)
 * This version implements the expert-validated, authoritative pattern for
 * Genkit v1.2.0 on a custom Express server. It resolves the middleware
 * paradox by applying express.json() as a route-specific middleware,
 * ensuring the request body is parsed correctly without stream conflicts.
 * This is the stable bedrock and the final version.
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

// The JSON parser is applied as route-specific middleware,
// just before the Genkit handler in the chain.
app.post(
  '/helloFlow',
  express.json({ limit: '10mb' }), // Middleware for this route only
  expressHandler(helloFlow)         // The Genkit handler
);

// Health check for Cloud Run readiness probe.
app.get('/healthz', (req, res) => res.status(200).send('OK'));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});