import { beforeEach, describe, expect, test } from 'vitest';
import { getQueryContext } from '../src/helpers/contextHelpers';
import { getQueryJson } from '../src/helpers/promptHelpers';
import NLxCache from '../src/lib/cache';
import { NLxContext, NLxQueryResponse } from '../src/types';

describe('contextHelpers', () => {
  describe('getQueryContext()', () => {
    test('returns a valid query context object', () => {
      const context = new Map([['test', 'value']]);
      const queryContext = getQueryContext(context);
      expect(queryContext).toEqual({ test: 'value' });
    });

    test('returns an empty object if context is empty', () => {
      const context = new Map();
      const queryContext = getQueryContext(context);
      expect(queryContext).toEqual({});
    });
  });

  describe('getQueryContext()', () => {
    test('returns a valid NLxQueryContext JSON object', () => {
      const context: NLxContext = new Map();
      context.set('hello', 'nlx');
      const queryContext = getQueryContext(context);
      expect(queryContext).toEqual({
        hello: 'nlx',
      });
    });
  });

  describe('getQueryJson()', () => {
    test('returns a valid query JSON string', () => {
      const context: NLxContext = new Map();
      context.set('test', 'value');
      const queryContext = getQueryContext(context);
      const queryJson = getQueryJson(
        queryContext,
        "What's the meaning of everything?",
        'boolean',
        '42',
      );
      expect(queryJson).toEqual(
        '{"query":"What\'s the meaning of everything?","predicate":"42","answerFormat":"boolean","context":{"test":"value"}}',
      );
    });
  });

  describe('getUserPrompt()', () => {
    test('passes all properties to the query', () => {
      const context: NLxContext = new Map();
      context.set('abc', 'hello world');
      context.set('the meaning of life', '42');
      const queryContext = getQueryContext(context);
      const userPrompt = getQueryJson(
        queryContext,
        "What's the meaning of everything?",
        'boolean',
        '42',
      );
      expect(userPrompt).toEqual(
        '{"query":"What\'s the meaning of everything?","predicate":"42","answerFormat":"boolean","context":{"abc":"hello world","the meaning of life":"42"}}',
      );
    });
  });
});

describe('cacheHelpers', () => {
  describe('addToCache()', () => {
    let cache: NLxCache;
    beforeEach(() => {
      cache = new NLxCache();
    });

    test('adds a new entry to the cache', () => {
      const query = "What's the meaning of everything?";
      const returnType = 'boolean';
      const response: NLxQueryResponse = {
        answer: true,
        format: 'boolean',
        confidence: 0.9,
      };
      const key = cache.save(query, returnType, response);
      const cacheTable = cache.toJSON();
      expect(cacheTable).toEqual({
        [key]: response,
      });
    });

    test('overwrites an existing entry in the cache', () => {
      const query = "What's the meaning of everything?";
      const returnType = 'boolean';
      const response: NLxQueryResponse = {
        answer: true,
        format: 'boolean',
        confidence: 0.9,
      };
      const key = cache.save(query, returnType, response);
      const cacheTable = cache.toJSON();
      expect(cacheTable).toEqual({
        [key]: response,
      });

      const query2 = "What's the meaning of everything?";
      const returnType2 = 'boolean';
      const response2: NLxQueryResponse = {
        answer: false,
        format: 'boolean',
        confidence: 0.9,
      };
      const key2 = cache.save(query2, returnType2, response2);
      const cacheTable2 = cache.toJSON();
      expect(cacheTable2).toEqual({
        [key2]: response2,
      });
    });
  });

  describe('getFromCache()', () => {
    let cache: NLxCache;
    beforeEach(() => {
      cache = new NLxCache();
    });

    test('returns undefined if the key is not in the cache', () => {
      const result = cache.get("What's the meaning of everything?", 'boolean');
      expect(result).toBeUndefined();
    });

    test('returns the value if the key is in the cache', () => {
      const response = {
        answer: true,
        format: 'boolean',
        confidence: 0.9,
      } satisfies NLxQueryResponse;
      cache.save("What's the meaning of everything?", 'boolean', response);
      const result = cache.get("What's the meaning of everything?", 'boolean');
      expect(result).toEqual(response);
    });
  });
});
