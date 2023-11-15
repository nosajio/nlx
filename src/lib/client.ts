import OpenAI from 'openai';
import { getSystemPrompt, getUserPrompt } from '../helpers/promptHelpers';
import { assertNLxQueryResponse } from '../helpers/responseHelpers';
import {
  NLxConfig,
  NLxContext,
  NLxQueryResponse,
  NLxQueryReturnType,
} from '../types';
import { VALID_RETURN_TYPES } from '../constants';

export class NLxClient {
  private context: NLxContext = new Map();
  private client: OpenAI;

  constructor({ openaiConfig }: NLxConfig) {
    this.client = new OpenAI(openaiConfig);
  }

  private upsertContext(key: string, value: string) {
    this.context.set(key, value);
  }

  /**
   * Builds & run a new query from parameters and return the result.
   * Will return undefined if the query fails.
   */
  private async newQuery(
    query: string,
    returnType: NLxQueryReturnType,
    predicate?: string,
  ): Promise<NLxQueryResponse | undefined> {
    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(
      this.context,
      query,
      returnType,
      predicate,
    );
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages,
      });
      const answer = response.choices[0].message.content ?? '{}';
      const answerObj = JSON.parse(answer);
      assertNLxQueryResponse(answerObj);

      return answerObj;
    } catch (error) {
      console.log('user prompt', userPrompt);
      console.error(error);
      return undefined;
    }
  }

  public use(key: string, value: string) {
    this.upsertContext(key, value);
  }

  public query(returnType: NLxQueryReturnType = 'string') {
    if (!VALID_RETURN_TYPES.includes(returnType)) {
      throw new Error(
        `Invalid return type: ${returnType}. Must be one of ${VALID_RETURN_TYPES.join(
          ', ',
        )}`,
      );
    }

    return async (s: TemplateStringsArray) => {
      const query = s.join(' ');
      return await this.newQuery(query, returnType);
    };
  }

  public does(predicate: string) {
    if (!predicate) {
      throw new Error('Input must be a non-empty string');
    }
    return async (s: TemplateStringsArray) => {
      const query = ['does', `"${predicate}"`, ...s].join(' ');
      return this.newQuery(query, 'boolean', predicate);
    };
  }

  public getContext() {
    return new Map(this.context);
  }
}

export default NLxClient;
