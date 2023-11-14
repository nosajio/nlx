import { ClientOptions as OpenAiClientOptions } from 'openai';

export type NlxConfig = {
  openaiConfig: OpenAiClientOptions;
};

export type QueryReturnType = 'boolean' | 'string' | 'number';
