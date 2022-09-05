import { ValueViewer } from './ValueViewer';
import { useAbciQuery } from './utils';

type Props = {
  node: string;
  path: string;
};

export function DataViewer({ node, path }: Props) {
  const { isLoading, error, data } = useAbciQuery(node, `/custom/vstorage/data/${path}`);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  if (!data) {
    return <div>Data not found</div>;
  }

  try {
    const { blockHeight, values } = JSON.parse(data.value);

    return (
      <>
        <div>Height: {blockHeight}</div>
        {values.map((v: string, index: number) => (
          <ValueViewer raw={v} key={v} index={index} />
        ))}
      </>
    );
  } catch (err) {
    return <div>Failed to parse: {data.value}</div>;
  }
}
