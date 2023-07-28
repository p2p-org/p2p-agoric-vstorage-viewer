import { useAbciQuery, useToggleKeys, useTrackKeys } from './utils';
import { DataViewer } from './DataViewer';
import * as s from './KeyTree.module.css';

type Props = {
  path: string;
  defaultOpenKeys: { [path: string]: string[] };
  defaultDataKeys: { [path: string]: string[] };
};

export function KeyTree({ path, defaultOpenKeys, defaultDataKeys }: Props) {
  const [openKeys, toggleOpenKey] = useToggleKeys(defaultOpenKeys[path]);
  const [dataKeys, toggleDataKey] = useToggleKeys(defaultDataKeys[path]);
  const { isLoading, error, data } = useAbciQuery(`/custom/vstorage/children/${path}`);

  useTrackKeys(path, openKeys, dataKeys);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <div style={{ paddingLeft: 20 }}>
      {data.children.length === 0 && <div>Children not found</div>}
      {data.children.map((k: string) => {
        const toggleKey = () => toggleOpenKey(k);
        const toggleData = () => toggleDataKey(k);
        const toggleAll = () => {
          toggleKey();
          toggleData();
        };

        return (
          <div key={k} className={s.item}>
            <div>
              <span className={s.path}>{k}</span>
              <button type="button" title="Load children keys" onClick={toggleKey}>
                {openKeys.includes(k) ? '↑' : '↓'}
              </button>
              <button type="button" title="Load data" onClick={toggleData}>
                d
              </button>
              <button type="button" title="Load data" onClick={toggleAll}>
                a
              </button>
            </div>
            {openKeys.includes(k) && (
              <KeyTree
                path={path ? `${path}.${k}` : k}
                defaultOpenKeys={defaultOpenKeys}
                defaultDataKeys={defaultDataKeys}
              />
            )}
            {dataKeys.includes(k) && <DataViewer path={path ? `${path}.${k}` : k} />}
          </div>
        );
      })}
    </div>
  );
}
