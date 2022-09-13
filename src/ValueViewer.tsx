import ReactJson from 'react-json-view';
import { useStore } from './store';
import * as s from './ValueViewer.module.css';

type Props = {
  raw: string;
  index: number;
};

const foldAmountObject = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      if (obj[key].brand && obj[key].value) {
        // can do this because we get `obj` from JSON.parse
        // eslint-disable-next-line no-param-reassign
        obj[key] = `${obj[key].value.digits} ${obj[key].brand.iface.replace('Alleged: ', '')}`;
      } else if (typeof obj[key] === 'object') {
        foldAmountObject(obj[key]);
      }
    }
  });
};

export function ValueViewer({ raw, index }: Props) {
  const { foldAmountObject: fao } = useStore('foldAmountObject');

  const value = JSON.parse(raw);
  const body = JSON.parse(value.body);

  if (fao) {
    foldAmountObject(body);
  }

  return (
    <div className={s.root}>
      <ReactJson src={body} name={`value${index}`} />
    </div>
  );
}
