import { useEffect, useState, FormEvent } from 'react';
import { useStore } from './store';
import * as s from './Settings.module.css';

type Props = {
  newNode: string;
};

export function Settings({ newNode }: Props) {
  const { node, foldAmountObject, dispatch } = useStore('node', 'foldAmountObject');
  const [currentNode, setCurrentNode] = useState(newNode || node);

  useEffect(() => {
    if (newNode) {
      dispatch('setNode', newNode);
    }
  }, [node, newNode, dispatch]);

  const saveNode = (e: FormEvent) => {
    e.preventDefault();
    dispatch('setNode', currentNode);
  };

  const toggleFoldAmountObject = () => dispatch('toggleFoldAmountObject');

  return (
    <form onSubmit={saveNode}>
      Node:
      <div>
        <input value={currentNode} onChange={(e) => setCurrentNode(e.target.value)} className={s.nodeInput} />
        <button type="submit">Save</button>
      </div>
      <div>
        <label htmlFor="toggleFoldAmountObject">
          <input
            id="toggleFoldAmountObject"
            type="checkbox"
            checked={foldAmountObject}
            onChange={toggleFoldAmountObject}
          />
          Fold an amount object
        </label>
      </div>
    </form>
  );
}
