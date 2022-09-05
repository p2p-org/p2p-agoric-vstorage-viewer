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
        params: { path: `/custom/vstorage/${path}` },
      }),
    })
      .then((res) => res.json())
      .then((d) => JSON.parse(atob(d.result.response.value))),
  );

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

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
};
