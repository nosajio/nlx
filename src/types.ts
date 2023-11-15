import { ClientOptions as OpenAiClientOptions } from 'openai';

// Root
export type NLxConfig = {
  openaiConfig: OpenAiClientOptions;
};

// Context
export type NLxContext = Map<string, string>;

// Queries
export type NLxQueryReturnType = 'boolean' | 'string' | 'number';

export type NLxQueryContext = Record<string, string>;

export type NLxQuery = {
  query: string;
  predicate: string;
  context: NLxQueryContext;
  returnType: NLxQueryReturnType;
};

export type NLxQueryResponse = {
  answer: boolean | string | number;
  format: NLxQueryReturnType;
  confidence: number;
};

type NLxJsonArray = Array<NLxJsonValue>;

export type NLxJsonValue =
  | string
  | number
  | boolean
  | null
  | NLxJsonObject
  | NLxJsonArray;

export type NLxJsonObject = {
  [key: string]: NLxJsonValue;
};
