import { SYSTEM_PROMPT } from '../constants';
import { NLxContext, NLxQueryContext, NLxQueryReturnType } from '../types';
import { getQueryContext } from './contextHelpers';

export function getSystemPrompt() {
  return SYSTEM_PROMPT;
}

export function getUserPrompt(
  context: NLxContext,
  query: string,
  returnType: NLxQueryReturnType,
  predicate?: string,
) {
  const queryContext = getQueryContext(context);
  const queryJson = getQueryJson(queryContext, query, returnType, predicate);
  return queryJson;
}

export function getQueryJson(
  context: NLxQueryContext,
  query: string,
  returnType: NLxQueryReturnType,
  predicate?: string,
) {
  return JSON.stringify({
    query,
    predicate,
    answerFormat: returnType,
    context,
  });
}
