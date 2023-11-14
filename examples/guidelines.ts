import { does } from './client';

async function moderateComment(comment: string) {
  return does(comment)`meet our community guidelines?`;
}
