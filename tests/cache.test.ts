import { beforeEach, describe, expect, test } from 'vitest';
import NLxCache from '../src/lib/cache';
import { NLxQueryResponse } from '../src/types';

describe('NLxCache', () => {
  describe('.save()', () => {
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

  describe('.get()', () => {
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

  describe('.clear()', () => {
    test('clears the cache', () => {
      const cache = new NLxCache();
      const response = {
        answer: true,
        format: 'boolean',
        confidence: 0.9,
      } satisfies NLxQueryResponse;
      cache.save("What's the meaning of everything?", 'boolean', response);
      cache.clear();
      expect(cache.size()).toBe(0);
    });
  });
});
