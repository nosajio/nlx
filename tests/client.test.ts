import { http } from 'msw';
import { setupServer } from 'msw/node';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import NLx from '../src/index';
import { NLxQueryResponse } from '../src/types';

describe('new NLx()', () => {
  test('new client returns a nlx instance', () => {
    const client = new NLx({
      openAiConfig: { apiKey: 'test-key' },
    });
    expect(client).toBeInstanceOf(NLx);
  });

  test('new client throws if no openAiConfig is provided', () => {
    expect(() => {
      // @ts-expect-error
      new NLx({});
    }).toThrow();
  });

  test('multiple clients can be created', () => {
    const client1 = new NLx({
      openAiConfig: { apiKey: 'test-key-1' },
    });
    const client2 = new NLx({
      openAiConfig: { apiKey: 'test-key-2' },
    });

    expect(client1).toBeInstanceOf(NLx);
    expect(client2).toBeInstanceOf(NLx);
  });
});

describe('NLx.use()', () => {
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

  test('client context is empty by default', () => {
    expect(client.getContext()).toEqual(new Map());
  });

  test('client context can be set with key, value', () => {
    client.use('test', 'value');
    expect(client.getContext()).toEqual(new Map([['test', 'value']]));
  });

  test('client context will convert json to strings', () => {
    client.use('test', { hello: 'world' });
    expect(client.getContext()).toEqual(
      new Map([['test', '{"hello":"world"}']]),
    );
  });

  test('client context will convert numbers and booleans to strings', () => {
    client.use('test', 42.2);
    client.use('test2', true);
    expect(client.getContext()).toEqual(
      new Map([
        ['test', '42.2'],
        ['test2', 'true'],
      ]),
    );
  });

  test('adding to cache invalidates and clears the cache', async () => {
    const handler = vi.fn();
    const server = setupServer(
      http.post('https://api.openai.com/v1/chat/completions', handler),
    );
    server.listen();

    const result1 = await client.query('boolean')`is the earth flat?`;
    const cacheJson = client.cache.toJSON();
    expect(Object.values(cacheJson)).toEqual([result1]);
    expect(client.cache.size()).toBe(1);
    client.use('cacheTest', 'value');
    expect(client.cache.size()).toBe(0);
  }, 10000);
});
