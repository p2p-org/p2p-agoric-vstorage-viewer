import { createStoreon, StoreonModule } from 'storeon';
import { persistState } from '@storeon/localstorage';
import { useStoreon } from 'storeon/react';

type State = {
  node: string;
  foldAmountObject: boolean;
};

type Events = {
  setNode: string;
  toggleFoldAmountObject: undefined;
};

const mainModule: StoreonModule<State, Events> = (store) => {
  store.on('@init', () => ({
    node: 'http://localhost:26657',
    foldAmountObject: true,
  }));

  store.on('setNode', (state, node) => ({ node }));
  store.on('toggleFoldAmountObject', (state) => ({ foldAmountObject: !state.foldAmountObject }));
};

export const store = createStoreon<State, Events>([mainModule, persistState(['node', 'foldAmountObject'])]);

export const useStore = useStoreon<State, Events>;
