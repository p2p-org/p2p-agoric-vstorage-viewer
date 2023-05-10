import ReactJson from 'react-json-view';
import { makeMarshal } from '@endo/marshal';
import { Far } from '@endo/far';
import { useStore } from './store';
import * as s from './ValueViewer.module.css';

type Props = {
  raw: string;
  index: number;
};

const convertSlotToVal = (slot: any, iface?: string) => {
  if (!iface) {
    return '???';
  }

  return Far(iface, {
    getIface: () => iface.replace('Alleged: ', ''),
  });
};

const { unserialize } = makeMarshal(undefined, convertSlotToVal);

const convert = (val: any) => {
  if (typeof val !== 'object' || val === null) {
    return val;
  }

  if (val.brand && val.value) {
    // convert to string. val.value is a bigint, val.brand is a Far
    return `${val.value} ${val.brand.getIface()}`;
  }

  const newVal: any = {};
  Object.keys(val).forEach((key) => {
    newVal[key] = convert(val[key]);
  });

  return newVal;
};

export function ValueViewer({ raw, index }: Props) {
  const { foldAmountObject: fao } = useStore('foldAmountObject');

  let value = unserialize(JSON.parse(raw));
  if (fao) {
    value = convert(value);
  }

  // avoid problems with JSON.parse inside react-json-view:
  // Do not know how to serialize a BigInt
  value = JSON.parse(JSON.stringify(value, (key, v) => (typeof v === 'bigint' ? v.toString() : v)));

  return (
    <div className={s.root}>
      <ReactJson src={value} name={`value${index}`} />
    </div>
  );
}
