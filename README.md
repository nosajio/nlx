# Natural Language in Code

Make your code more powerful with LLMs.

## 🌟 Quick demo

```ts
import {does} from './client';

/**
 * Add a new comment if it meets the community guidelines
 */
const addComment = async (comment: string) => {
  if (await does(comment)`meet the community guidelines?`) {
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
