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
      const o = obj[key];

      if (o.brand && o.value && o.value.digits) {
        // can do this because we get `obj` from JSON.parse
        // eslint-disable-next-line no-param-reassign
        obj[key] = `${o.value.digits} ${(o.brand.iface || '???').replace('Alleged: ', '')}`;
      } else if (typeof o === 'object') {
        foldAmountObject(o);
      }
    }
  });
};

export function ValueViewer({ raw, index }: Props) {
  const { foldAmountObject: fao } = useStore('foldAmountObject');

  const value = JSON.parse(raw);
  const body = JSON.parse(value.body.replace(/^#{/, '{'));

  if (fao) {
    foldAmountObject(body);
  }

  return (
    <div className={s.root}>
      <ReactJson src={body} name={`value${index}`} />
    </div>
  );
}
