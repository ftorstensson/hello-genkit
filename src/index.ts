/*
 * Hello Genkit - Definitive Production Version v3.0 (Authoritative)
 * This version resolves all previous errors by correctly capturing the
 * return value of the genkit() initialization function into a constant,
 * which provides the necessary 'ai' instance to define flows.
 * This is the stable bedrock.
 */

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import express from 'express';
import { expressHandler } from '@genkit-ai/express';

// --- Initialization ---
// CRITICAL: Assign the return value of genkit() to a constant.
const ai = genkit({
  plugins: [googleAI()],
});

// --- Schema ---
const HelloSchema = z.object({
  name: z.string().describe('A simple name for greeting'),
});

// --- Flow ---
// Use ai.defineFlow on the initialized instance.
export const helloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: HelloSchema,
    outputSchema: z.string(),
  },
  async (input: z.infer<typeof HelloSchema>) => {
    console.log('[helloFlow] Request received. Body:', input);
    return `Hello, ${input.name}!`;
  }
);

// --- Express Server Setup ---
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));
app.post('/helloFlow', expressHandler(helloFlow));
app.get('/healthz', (req, res) => res.status(200).send('OK'));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});