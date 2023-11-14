import { NLxQueryResponse } from '../types';

export function assertNLxQueryResponse(
  res: unknown,
): asserts res is NLxQueryResponse {
  // Ensure response is an object
  if (typeof res !== 'object' || res === null) {
    throw new Error('Response must be an object');
  }
  // Ensure answer is of the right type
  if (
    !['string', 'boolean', 'number'].includes(
      typeof (res as NLxQueryResponse).answer,
    )
  ) {
    throw new Error('Response must have an answer property of type string');
  }
  // Ensure format is of the right type and value
  if (typeof (res as NLxQueryResponse).format !== 'string') {
    throw new Error('Response must have a format property of type string');
  }
  if (
    !['string', 'boolean', 'number'].includes((res as NLxQueryResponse).format)
  ) {
    throw new Error(
      'Response must have a format property of value string, boolean, or number',
    );
  }
  if (typeof (res as NLxQueryResponse).confidence !== 'number') {
    throw new Error('Response must have a confidence property of type number');
  }
}
