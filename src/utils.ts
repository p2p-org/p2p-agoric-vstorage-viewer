import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useStore } from './store';

export const useAbciQuery = (path: string, height?: number) => {
  const { node } = useStore('node');

  return useQuery(`${path}:${height}`, () => {
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
  });
};

export const useToggleKeys = (): [string[], (k: string) => void] => {
  const [keys, setKeys] = useState<string[]>([]);

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
