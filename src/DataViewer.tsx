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

  // eslint-ignore-next-line no-console
  console.log(data);

  try {
    const value = JSON.parse(data.value);

    if (typeof value === 'string' || typeof value === 'number') {
      return <div>{value}</div>;
    }

    return <ReactJson src={value} />;
  } catch (err) {
    return <div>Failed to parse: {data.value}</div>
  }
}
