import OpenAI from 'openai';
import { getSystemPrompt, getUserPrompt } from '../helpers/promptHelpers';
import { NLxConfig, NLxContext, NLxQueryReturnType } from '../types';

export class NLxClient {
  private context: NLxContext = new Map();
  private client: OpenAI;

  constructor({ openaiConfig }: NLxConfig) {
    this.client = new OpenAI(openaiConfig);
  }

  private upsertContext(key: string, value: string) {
    this.context.set(key, value);
  }

  private chatQuery(
    query: string,
    predicate: string,
    returnType: NLxQueryReturnType,
  ) {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: getSystemPrompt(),
      },
      {
        role: 'user',
        content: getUserPrompt(this.context, query, returnType, predicate),
      },
    ];

    this.client.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages,
    });
  }

  public use(key: string, value: string) {
    this.upsertContext(key, value);
  }

  public does(input: string) {
    if (!input) {
      throw new Error('Input must be a non-empty string');
    }
    return (s: TemplateStringsArray) => {
      const query = ['does', ...s].join(' ');
      return this.chatQuery(query, input, 'boolean');
    };
  }

  public getContext() {
    return new Map(this.context);
  }
}

export default NLxClient;
