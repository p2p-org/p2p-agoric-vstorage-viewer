import { QueryClient, QueryClientProvider } from 'react-query';
import { Viewer } from './Viewer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Viewer path="" node="https://xnet.rpc.agoric.net:443" />
    </QueryClientProvider>
  );
}

export default App;
