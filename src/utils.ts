import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';

export const useStorageQuery = (node: string, path: string) =>
  useQuery(path, () =>
    fetch(node, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'abci_query',
        params: { path: `/custom/vstorage/${  path}` },
      }),
    })
      .then((res) => res.json())
      .then((d) => JSON.parse(atob(d.result.response.value))),
  );

export const useToggleKeys = (): [string[], (k: string) => void] => {
  const [keys, setKeys] = useState<string[]>([]);

  const toggle = useCallback((key: string) => {
    setKeys(ks => {
      if (ks.includes(key)) {
        return ks.filter(k => k !== key);
      } 
        return [...ks, key];
      
    });
  }, []);

  return [keys, toggle];
}
