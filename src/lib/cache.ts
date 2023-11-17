import { getCacheKey } from '../helpers/cacheHelpers';
import { NLxCacheTable, NLxQueryResponse, NLxQueryReturnType } from '../types';

export default class NLxCache {
  constructor(private store: NLxCacheTable = new Map()) {}

  /**
   * Hash a key for the hash table
   */
  private hash(query: string, returnType: NLxQueryReturnType) {
    const key = getCacheKey(query, returnType);
    return key;
  }

  /**
   * Save a query response to the cache.
   */
  save(
    query: string,
    returnType: NLxQueryReturnType,
    response: NLxQueryResponse,
  ) {
    const key = this.hash(query, returnType);
    this.store.set(key, response);
    return key;
  }

  /**
   * Get a query response from the cache.
   */
  get(query: string, returnType: NLxQueryReturnType) {
    const key = this.hash(query, returnType);
    return this.store.get(key);
  }

  /**
   * Clear the cache
   */
  clear() {
    this.store.clear();
  }

  /**
   * Return the size of the cache
   */
  size() {
    return this.store.size;
  }

  /**
   * Return the cache as JSON
   */
  toJSON() {
    const json: Record<string, NLxQueryResponse> = {};
    for (const [key, value] of this.store) {
      json[key] = value;
    }
    return json;
  }
}
