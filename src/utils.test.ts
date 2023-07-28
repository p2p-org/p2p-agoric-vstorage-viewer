import { encodeHashState, decodeHashState } from './utils';

test('encodeHashState', () => {
  expect(
    encodeHashState({
      n: 'https://main.rpc.agoric.net',
      o: {
        '': ['published'],
        published: ['reserve', 'psm'],
      },
      d: {
        'published.reserve': ['metrics'],
      },
    }),
  ).toBe('https://main.rpc.agoric.net|published,published.reserve,published.psm|published.reserve.metrics');

  expect(
    encodeHashState({
      n: 'https://main.rpc.agoric.net',
      o: {
        '': ['published'],
        published: ['reserve', 'psm'],
      },
      d: {},
    }),
  ).toBe('https://main.rpc.agoric.net|published,published.reserve,published.psm|');

  expect(
    encodeHashState({
      n: 'https://main.rpc.agoric.net',
      o: {
        '': ['published'],
        published: ['reserve', 'psm', 'agoricNames'],
      },
      d: {},
    }),
  ).toBe('https://main.rpc.agoric.net|published,published.reserve,published.psm,published.agoricNames|');

  expect(
    encodeHashState({
      n: 'https://main.rpc.agoric.net',
      o: {
        '': [],
      },
      d: {},
    }),
  ).toBe('https://main.rpc.agoric.net||');
});

test('decodeHashState', () => {
  expect(
    decodeHashState('https://main.rpc.agoric.net|published,published.reserve,published.psm|published.reserve.metrics'),
  ).toEqual({
    n: 'https://main.rpc.agoric.net',
    o: {
      '': ['published'],
      published: ['reserve', 'psm'],
    },
    d: {
      'published.reserve': ['metrics'],
    },
  });

  expect(decodeHashState('https://main.rpc.agoric.net|published,published.reserve,published.psm|')).toEqual({
    n: 'https://main.rpc.agoric.net',
    o: {
      '': ['published'],
      published: ['reserve', 'psm'],
    },
    d: {},
  });

  expect(
    decodeHashState('https://main.rpc.agoric.net|published,published.reserve,published.psm,published.agoricNames|'),
  ).toEqual({
    n: 'https://main.rpc.agoric.net',
    o: {
      '': ['published'],
      published: ['reserve', 'psm', 'agoricNames'],
    },
    d: {},
  });

  expect(decodeHashState('https://main.rpc.agoric.net||')).toEqual({
    n: 'https://main.rpc.agoric.net',
    o: {},
    d: {},
  });
});
