/*
 * Hello Genkit - Definitive Production Version v1.0
 * This is the stable bedrock, built according to expert validation.
 * It uses a manual Express server with explicit JSON body parsing
 * and the correct 'expressHandler' function to fix the body-parsing bug.
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
    console.log(`✅ [hello-genkit] Received input: ${JSON.stringify(input)}`);
    return `Hello, ${input.name}`;
  }
);

// --- Manual Express Server ---
const app = express();
app.use(express.json()); // Explicit JSON parsing

// Attach the flow to the /helloFlow endpoint
app.post('/helloFlow', expressHandler(helloFlow));

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ [hello-genkit] Server listening on port ${port}`);
});