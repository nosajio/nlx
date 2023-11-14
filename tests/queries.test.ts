import { beforeAll, describe, expect, test } from 'vitest';
import NLx from '../src/index';

describe('NLx.does()', () => {
  // configure the client
  let client: NLx;
  beforeAll(() => {
    if (!process.env.TEST_OPENAI_API_KEY) {
      throw new Error('TEST_OPENAI_API_KEY not set');
    }

    client = new NLx({
      openaiConfig: {
        apiKey: process.env.TEST_OPENAI_API_KEY,
      },
    });
  });

  test('does throws with an empty predicate', () => {
    expect(() => {
      // @ts-expect-error
      client.does();
    }).toThrow();

    expect(() => {
      client.does('');
    }).toThrow();
  });

  test('does returns a function', () => {
    const does = client.does('test');
    expect(does).toBeInstanceOf(Function);
  });
});
