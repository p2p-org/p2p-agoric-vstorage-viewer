import ReactJson from 'react-json-view';
import * as s from './ValueViewer.module.css';

type Props = {
  raw: string;
  index: number;
};

export function ValueViewer({ raw, index }: Props) {
  const value = JSON.parse(raw);
  const body = JSON.parse(value.body);

  return (
    <div className={s.root}>
      <ReactJson src={body} name={`body${index}`} />
    </div>
  );
}
