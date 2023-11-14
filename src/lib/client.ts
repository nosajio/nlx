import OpenAI from 'openai';
import { NlxConfig, QueryReturnType } from '../types';
import { CONTEXT_DIVIDER } from '../constants';

export class NlxClient {
  private context: Map<string, string> = new Map();
  private client: OpenAI;

  constructor({ openaiConfig }: NlxConfig) {
    this.client = new OpenAI(openaiConfig);
  }

  private upsertContext(key: string, value: string) {
    this.context.set(key, value);
  }

  private chatQuery(
    query: string,
    predicate: string,
    returnType: QueryReturnType,
  ) {
    const contextString = Array.from(this.context.entries())
      .map(
        ([key, value]) => `
    # ${key}
    ${value}
    `,
      )
      .join(CONTEXT_DIVIDER);

    this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [],
    });
  }

  public use(key: string, value: string) {
    this.upsertContext(key, value);
  }

  public does(input: string) {
    return (s: TemplateStringsArray) => {
      const query = ['does', ...s].join(' ');
      return this.chatQuery(query, input, 'boolean');
    };
  }
}

export default NlxClient;
