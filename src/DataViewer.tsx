/* eslint-disable react/no-array-index-key */

import { useState } from 'react';
import { ValueViewer } from './ValueViewer';
import { useAbciQuery } from './utils';
import * as s from './DataViewer.module.css';

type Props = {
  node: string;
  path: string;
};

export function DataViewer({ node, path }: Props) {
  const [heights, setHeights] = useState<number[]>([]);
  const [currentHeight, setCurrentHeight] = useState<number | undefined>();
  const { isLoading, error, data } = useAbciQuery(node, `/custom/vstorage/data/${path}`, currentHeight);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  try {
    const { blockHeight, values } = data ? JSON.parse(data.value) : { blockHeight: currentHeight, values: [] };

    const showPrev = () => {
      setHeights((items) => [...items, blockHeight]);
      setCurrentHeight(blockHeight - 1);
    };

    return (
      <>
        <div>Height: {blockHeight}</div>
        {currentHeight !== blockHeight && (
          <button type="button" onClick={showPrev}>
            Prev
          </button>
        )}
        {heights.map((h) => (
          <button key={h} type="button" onClick={() => setCurrentHeight(h)}>
            {h}
          </button>
        ))}
        {values.length === 0 && <div>Data not found</div>}
        <div className={s.values}>
          {values.map((v: string, index: number) => (
            <div className={s.value}>
              <ValueViewer raw={v} key={index} index={index} />
            </div>
          ))}
        </div>
      </>
    );
  } catch (err) {
    return <div>Failed to parse: {data.value}</div>;
  }
}
