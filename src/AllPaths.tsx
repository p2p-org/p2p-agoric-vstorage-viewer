import { useState } from 'react';
import { useQuery } from 'react-query';
import * as s from './AllPaths.module.css';
import { abciQuery, useNode } from './utils';

type KeyResponse = {
  children: string[];
};

const loadAllPaths = async (node: string, rootPath: string) => {
  const { children: keys }: KeyResponse = await abciQuery(node, `/custom/vstorage/children/${rootPath}`);
  const allPaths: string[] = [];

  await Promise.all(
    keys.map(async (key) => {
      const subPath = rootPath === '' ? key : `${rootPath}.${key}`;
      allPaths.push(subPath);

      const subPaths = await loadAllPaths(node, subPath);
      allPaths.push(...subPaths);
    }),
  );

  return allPaths;
};

export function AllPaths() {
  const node = useNode();
  const [enabled, setEnabled] = useState(false);
  const { isLoading, error, data } = useQuery(`allPaths:${node}`, () => loadAllPaths(node, ''), { enabled });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <div className={s.root}>
      <h3 className={s.title}>All paths</h3>
      {!enabled && (
        <button type="button" onClick={() => setEnabled(true)} disabled={isLoading}>
          Load
        </button>
      )}
      {data && data.map((path) => (
        <div key={path}>{path}</div>
      ))}
    </div>
  );
}
