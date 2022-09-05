import { useStorageQuery, useToggleKeys } from './utils';
import { DataViewer } from './DataViewer';

type Props = {
  node: string;
  path: string;
};

export function Viewer({ path, node }: Props) {
  const [openKeys, toggleOpenKey] = useToggleKeys();
  const [dataKeys, toggleDataKey] = useToggleKeys();
  const { isLoading, error, data } = useStorageQuery(node, `children/${path}`);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error: {error.toString()}</div>;
  }

  return (
    <div style={{ paddingLeft: 20 }}>
      {data.children.length === 0 && <div>Children not found</div>}
      {data.children.map((k: string) => (
        <div key={k}>
          <div>
            {k}
            <button type="button" title="Load children keys" onClick={() => toggleOpenKey(k)}>
              {openKeys.includes(k) ? '↑' : '↓'}
            </button>
            <button type="button" title="Load data" onClick={() => toggleDataKey(k)}>
              d
            </button>
          </div>
          {openKeys.includes(k) && <Viewer node={node} path={path ? `${path}.${k}` : k} />}
          {dataKeys.includes(k) && <DataViewer node={node} path={path ? `${path}.${k}` : k} />}
        </div>
      ))}
    </div>
  );
}
