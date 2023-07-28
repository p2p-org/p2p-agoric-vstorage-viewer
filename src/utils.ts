import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useStore } from './store';

export const abciQuery = (node: string, path: string, height?: number) => {
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

export const getDefaultHashState = () => {
  const currentHash = atob(window.location.hash.substr(1));

  if (currentHash) {
    return JSON.parse(currentHash) as HashState;
  }

  return {
    n: '',
    o: {},
    d: {},
  };
};

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

  const newLocation = btoa(JSON.stringify(data));

  if (newLocation !== window.location.hash.substr(1)) {
    window.location.hash = newLocation;
  }
};
