import { QueryClient, QueryClientProvider } from 'react-query';
import { StoreContext } from 'storeon/react';
import { KeyTree } from './KeyTree';
import { Settings } from './Settings';
import { AllPaths } from './AllPaths';
import { store } from './store';
import { getDefaultHashState } from './utils';

const queryClient = new QueryClient();
const defaultState = getDefaultHashState();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreContext.Provider value={store}>
        <Settings newNode={defaultState.n} />
        <KeyTree path="" defaultOpenKeys={defaultState.o} defaultDataKeys={defaultState.d} />
        <AllPaths />
      </StoreContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
