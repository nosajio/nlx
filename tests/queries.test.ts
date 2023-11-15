import { beforeAll, describe, expect, test } from 'vitest';
import NLx from '../src/index';

// configure the client
let client: NLx;
beforeAll(() => {
  if (!process.env.TEST_OPENAI_API_KEY) {
    throw new Error('TEST_OPENAI_API_KEY not set');
  }

  client = new NLx({
    openAiConfig: {
      apiKey: process.env.TEST_OPENAI_API_KEY,
    },
  });
});

describe('NLx.does()', () => {
  test('does() throws with an empty predicate', () => {
    expect(() => {
      // @ts-expect-error
      client.does();
    }).toThrow();

    expect(() => {
      client.does('');
    }).toThrow();
  });

  test('does()`...` returns a Promise', () => {
    const result = client.does('the meaning of life')`equal 42?`;
    expect(result).toBeInstanceOf(Promise);
  });

  test('does()`...` resolves to a NPxQueryResponse', async () => {
    const result = await client.does('abcde')`include any numbers?`;
    expect(result).toHaveProperty('answer');
    expect(result).toHaveProperty('format');
    expect(result).toHaveProperty('confidence');
  });
});

describe('NLx.query()', () => {
  test('query()`...` returns a Promise', () => {
    const result = client.query()`the meaning of life`;
    expect(result).toBeInstanceOf(Promise);
  });

  test('query()`...` resolves to a NPxQueryResponse', async () => {
    const result = await client.query()`the meaning of life`;
    expect(result).toHaveProperty('answer');
    expect(result).toHaveProperty('format');
    expect(result).toHaveProperty('confidence');
  });

  test('query(type)`...` type arg changes the return type', async () => {
    const resultString = await client.query(
      'string',
    )`the first three letters of the alphabet`;
    const resultNumber = await client.query('number')`return a prime number`;
    const resultBoolean = await client.query('boolean')`is the sky blue?`;
    expect(typeof resultString?.answer).toBe('string');
    expect(typeof resultNumber?.answer).toBe('number');
    expect(typeof resultBoolean?.answer).toBe('boolean');
  });

  test('query(type)`...` throws with an invalid type', () => {
    expect(() => {
      // @ts-expect-error
      client.query('invalid')`the meaning of life`;
    }).toThrow();
  });
});
