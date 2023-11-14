import { NLxContext, NLxQueryContext } from '../types';

/**
 * Returns a valid query context object as recognized by the NLx LLM schema
 */
export function getQueryContext(context: NLxContext): NLxQueryContext {
  return Object.fromEntries(context.entries());
}
