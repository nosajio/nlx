import Nlx from '../src';
import { guidelines } from './context';

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY is not set');
}

/**
 * Configure the client with an OpenAI API key
 */
const client = new Nlx({
  openaiConfig: { apiKey: openaiApiKey },
});

/**
 * Add sample community guidelines context
 */
client.use('guidelines', guidelines);

// Make access to helpers easier
export const does = client.does;
