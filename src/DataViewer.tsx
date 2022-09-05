import ReactJson from 'react-json-view'
import { useStorageQuery } from './utils';

type Props = {
  node: string;
  path: string;
};

export function DataViewer({ node, path }: Props) {
  const { isLoading, error, data } = useStorageQuery(node, `data/${  path}`);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error: {error.toString()}</div>;
  }

  const value = JSON.parse(data.value);

  return <ReactJson src={value} />;
}
