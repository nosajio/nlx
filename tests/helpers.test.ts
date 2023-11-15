import { describe, expect, test } from 'vitest';
import { getQueryContext } from '../src/helpers/contextHelpers';
import { getQueryJson } from '../src/helpers/promptHelpers';
import { NLxContext } from '../src/types';

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
