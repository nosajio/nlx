import nlx from '..';

describe('client setup', () => {
  test('new client returns a nlx instance', () => {
    const client = new nlx({
      openaiApiKey: 'test',
    });
    expect(client).toBeInstanceOf(nlx);
  });
});
