import { useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useStore } from './store';

let useLegacyApi = false;

export const legacyAbciQuery = (node: string, path: string, height?: number) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'abci_query',
      params: { path, height: height && height.toString() }, // height must be a string (bigint)
    }),
  };

  return fetch(node, options)
    .then((res) => res.json())
    .then((d) => d.result.response.value && JSON.parse(atob(d.result.response.value)));
};

export const apiQuery = (node: string, path: string, height?: number) => {
  const normalizedPath = path.replace(/^\/custom/, '/agoric');
  const url = `${node}${normalizedPath}`;

  const options: RequestInit = {};

  if (height) {
    options.headers = {
      'X-Cosmos-Block-Height': height.toString(),
    };
  }

  return fetch(url, options).then((res) => {
    // probably gave the old rpc url
    // https://github.com/Agoric/agoric-sdk/issues/9096
    if (res.status === 404) {
      useLegacyApi = true;
      return legacyAbciQuery(node, path, height);
    }

    return res.json();
  });
};

export const abciQuery = (node: string, path: string, height?: number) => {
  if (useLegacyApi) {
    return legacyAbciQuery(node, path, height);
  }

  return apiQuery(node, path, height);
};

export const useNode = () => useStore('node').node;

export const useAbciQuery = (path: string, height?: number) => {
  const node = useNode();

  return useQuery(`${node}:${path}:${height}`, () => abciQuery(node, path, height));
};

export const useToggleKeys = (defaultValues?: string[]): [string[], (k: string) => void] => {
  const [keys, setKeys] = useState<string[]>(defaultValues || []);

  const toggle = useCallback((key: string) => {
    setKeys((ks) => {
      if (ks.includes(key)) {
        return ks.filter((k) => k !== key);
      }
      return [...ks, key];
    });
  }, []);

  return [keys, toggle];
};

type HashState = {
  // node
  n: string;
  // open keys
  o: { [key: string]: string[] };
  // data
  d: { [key: string]: string[] };
};

export const encodeHashState = (data: HashState): string => {
  const oParts = Object.entries(data.o).flatMap(([key, values]) =>
    values.map((value) => (key ? `${key}.${value}` : value)),
  );

  const dParts = Object.entries(data.d).flatMap(([key, values]) => values.map((value) => `${key}.${value}`));

  return `${data.n}|${oParts.join(',')}|${dParts.join(',')}`;
};

export const decodeHashState = (v: string): HashState => {
  const parts = v.split('|');
  const n = parts[0];

  const oParts = parts[1].split(',').filter(Boolean);
  const o: { [key: string]: string[] } = oParts.reduce((acc: { [key: string]: string[] }, part) => {
    const lastDotIndex = part.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      const key = part.substring(0, lastDotIndex);
      const value = part.substring(lastDotIndex + 1);
      if (!acc[key]) acc[key] = [];
      acc[key].push(value);
    } else {
      if (!acc['']) acc[''] = [];
      acc[''].push(part);
    }
    return acc;
  }, {});

  const dParts = parts[2].split(',').filter(Boolean);
  const d: { [key: string]: string[] } = dParts.reduce((acc: { [key: string]: string[] }, part) => {
    const lastDotIndex = part.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      const key = part.substring(0, lastDotIndex);
      const value = part.substring(lastDotIndex + 1);
      if (!acc[key]) acc[key] = [];
      acc[key].push(value);
    }
    return acc;
  }, {});

  return { n, o, d };
};

export const getDefaultHashState = () => {
  const currentHash = decodeURIComponent(window.location.hash.substr(1));

  if (currentHash) {
    return decodeHashState(currentHash) as HashState;
  }

  return {
    n: '',
    o: {},
    d: {},
  };
};

// TODO: fix this hack
let skipNextHashUpdate = false;

export const useTrackKeys = (path: string, openKeys: string[], dataKeys: string[]) => {
  const data = getDefaultHashState();

  data.n = useNode();

  if (openKeys.length > 0) {
    data.o = { ...data.o, [path]: openKeys };
  } else {
    delete data.o[path];
  }

  if (dataKeys.length > 0) {
    data.d = { ...data.d, [path]: dataKeys };
  } else {
    delete data.d[path];
  }

  const newLocation = encodeHashState(data);

  if (newLocation !== window.location.hash.substr(1)) {
    window.location.hash = newLocation;
    skipNextHashUpdate = true;
  }
};

export const useDefaultHashState = (): [HashState, string] => {
  const [defaultState, setDefaultState] = useState(getDefaultHashState());

  useEffect(() => {
    const fn = () => {
      if (skipNextHashUpdate) {
        skipNextHashUpdate = false;
      } else {
        setDefaultState(getDefaultHashState());
      }
    };

    window.addEventListener('hashchange', fn);

    return () => window.removeEventListener('hashchange', fn);
  }, []);

  return [defaultState, encodeHashState(defaultState)];
};
