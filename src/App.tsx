import { QueryClient, QueryClientProvider } from 'react-query';
import { StoreContext } from 'storeon/react';
import { KeyTree } from './KeyTree';
import { Settings } from './Settings';
import { AllPaths } from './AllPaths';
import { store } from './store';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreContext.Provider value={store}>
        <Settings />
        <KeyTree path="" />
        <AllPaths />
      </StoreContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
