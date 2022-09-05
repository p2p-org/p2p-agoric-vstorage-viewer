import ReactJson from 'react-json-view';
import { useStorageQuery } from './utils';

type Props = {
  node: string;
  path: string;
};

export function DataViewer({ node, path }: Props) {
  const { isLoading, error, data } = useStorageQuery(node, `data/${path}`);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error: {error.toString()}</div>;
  }

  // you can analyze an object in dev tools
  // eslint-disable-next-line no-console
  console.log(data);

  try {
    const value = JSON.parse(data.value);

    if (typeof value === 'string' || typeof value === 'number') {
      return <div>{value}</div>;
    }

    let bodyJson: any;

    if (value.body) {
      try {
        const body = JSON.parse(value.body);
        bodyJson = <ReactJson src={body} name="body" />;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }

    return (
      <>
        <ReactJson src={value} name="data" />
        {bodyJson}
      </>
    );
  } catch (err) {
    return <div>Failed to parse: {data.value}</div>;
  }
}
