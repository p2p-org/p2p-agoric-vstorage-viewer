import { QueryClient, QueryClientProvider } from 'react-query';
import { StoreContext } from 'storeon/react';
import { KeyTree } from './KeyTree';
import { Settings } from './Settings';
import { AllPaths } from './AllPaths';
import { store } from './store';
import { useDefaultHashState } from './utils';

const queryClient = new QueryClient();

function App() {
  const [defaultState, stateKey] = useDefaultHashState();

  return (
    <QueryClientProvider client={queryClient}>
      <StoreContext.Provider value={store} key={stateKey}>
        <Settings newNode={defaultState.n} />
        <KeyTree path="" defaultOpenKeys={defaultState.o} defaultDataKeys={defaultState.d} />
        <AllPaths />
      </StoreContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
