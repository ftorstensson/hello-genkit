import { genkit, z } from 'genkit';
import { startFlowServer } from '@genkit-ai/express';
import { googleAI } from '@genkit-ai/google-genai'; // We must import the AI provider

// --- Initialization ---
const ai = genkit({
  plugins: [
    googleAI(), // We must initialize the AI plugin
  ],
});

// Define the schema for our input
const HelloSchema = z.object({ name: z.string() });

export const helloFlow = ai.defineFlow({ // CORRECT SYNTAX: defineFlow is attached to the 'ai' object
    name: 'helloFlow',
    inputSchema: HelloSchema,
    outputSchema: z.string(),
},
async (input) => { // TypeScript can now infer the type correctly
    console.log(`✅ Received input: ${JSON.stringify(input)}`);
    return `Hello, ${input.name}`;
});

if (process.env.GENKIT_ENV !== 'dev') {
    startFlowServer({
        port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
        flows: [helloFlow],
    });
}