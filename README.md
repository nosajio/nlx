# Natural Language in Code

[![NPM version](https://img.shields.io/npm/v/nlx.svg)](https://npmjs.org/package/nlx)

Make your code more powerful with LLMs.

## 🌟 Quick example

```ts
// client.ts
import NLx from 'nlx';
import guidelines from './guidelines.json';

const client = new NLx({
  openAiConfig: {
    apiKey: 'sk-...'
  }
});

client.use('Community guidelines', guidelines);

export default client;
```

```ts
// comments.ts

import client from './client';

/**
 * Add a new comment if it meets the community guidelines
 */
const addComment = async (comment: string) => {
  if (await client.does(comment)`meet the community guidelines?`) {
    await saveComment(comment);
  } else {
    await returnError('COMMENT_NOT_ALLOWED');
  }
}
```

## ☑️ Getting Started with nlx


## Install 

```
npm install nlx
```

```
pnpm add nlx
```

```
yarn add nlx
```

### Configuration 

```ts

```

## Functions

### `use`

### `does`
