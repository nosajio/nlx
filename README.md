<p align="center">
  <a href="https://fingerprint.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="resources/logo-light.svg" />
      <source media="(prefers-color-scheme: light)" srcset="resources/logo-dark.svg" />
      <img src="resources/logo-dark.svg" alt="NLx logo" width="128px" />
    </picture>
  </a>
</p>
<h1 align="center">Natural Language in Code</h1>
<p align="center">
  <a href="https://npmjs.org/package/nlx">
    <img src="https://img.shields.io/npm/v/nlx.svg" alt="NPM version" />
  </a>
</p>

NLx is a lightweight, strictly typed query library built on top of GPT-4. By using a query interface, the LLM can be leveraged like any other JS function.

NLx can classify for you, pattern match, and perform complex logic with minimal configuration.

## 🪄 Demo

```ts
// client.ts

import NLx from 'nlx';
import guidelines from './guidelines.json';

// 1. Setup the client with your OpenAI API key
const client = new NLx({
  openAiConfig: {
    apiKey: 'sk-...'
  }
});

// 2. (optional) add context for use with queries
client.use('Community guidelines', guidelines);

export default client;
```

```ts
// example.ts

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

/**
 * Basic pattern matching
 */
const includesGreeting = async () => {
  return await client.does('Hello world')`include a greeting?`
}
```


## ️✅ Getting Started

## Install 
With npm

```
npm install nlx
```
With pnpm

```
pnpm add nlx
```
With bun

```
bun install nlx
```

> [!IMPORTANT]  
> Be aware that it's possible for outputs from NLx queries to change over time. Outputs are sensitive to changes OpenAI makes to GPT4.

### Configuration 
Configuration requires an `openAiConfig` object, which uses the same API as the OpenAI nodejs client. 

It's recommended to store your apiKey in a `.env` file.

```ts
import NLx from 'nlx';

const apiKey = process.env.OPENAI_API_KEY;

// Initialize a new client
const client = new NLx({
  openAiConfig: { apiKey }
});

export default client;
```

#### Add context
Context strings can be added to the client instance from anywhere in the app. Context is passed to the LLM as a key value pair in each query.

```ts
// Add different context types to a client
import client from './client';
import document from './page.md';
import userInfo from './info.json';

client.use('Meaning of life', 42);          // Numbers
client.use('A document', document);         // Strings
client.use('User information', userInfo);   // Raw json
client.use('Is new user', true);            // Booleans
```

## 🌟 Query API
NLx currently supports two query types and *more coming soon!*

#### Template literals
All queries require a template literal to be passed that contains the query to be evaluated.

You can also pass variables to template literals to do things like: 
```ts
await does('hello')`rhyme with ${word}?`
```

### ``client.does(value)`...`: boolean ``
The `does` function takes a `value` string and a query string, and returns a `boolean`. `does` should be used to test for truthyness. 

It's just like asking a question of your code, like "Does ABC include the letter X?"

```ts 
await does('ABC')`include the letter X?`; // false
```

### ``client.query(type)`...` ``
The `query` function exposes the raw query interface and can return any supported type. Use `query` to run less restrictive queries.

```ts
// Return a string
await client.query('string')`the first three letters of the alphabet`; // Ex: "abc"

// Return a number
await client.query('number')`return a prime number` // Ex: 3

// Return a boolean
await client.query('boolean')`is the sky blue?` // Ex: true
```

`query` always returns a response object consisting of `answer`, `format`, and `confidence`.

```ts
const result = await client.query('string')`the first three letters of the alphabet`;

// result = 
// {
//   "answer": "abc",       <- The query answer
//   "format": "string",    <- The requested answer format
//   "confidence": 1,       <- The LLM's confidence level
// }
```

Note that responses from `query` are not as predictable as other functions.

## Tips & tricks

### Alias variables
```ts
// query.ts
import client from './client';

export const does = client.does;
export const query = client.query;

// myFile.ts
import { does } from './query';

await does('a bird')`fly?`
```

### Alias values
```ts
// helpers.ts
import { does } from './query';

export const doesComment = does(comment);

// ...

await doesComment`meet the community guidelines?`;
```
