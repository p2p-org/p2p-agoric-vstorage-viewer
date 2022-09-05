import { useState, FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { KeyTree } from './KeyTree';
import { useLocalStorage } from './utils';
import * as s from './App.module.css';

const queryClient = new QueryClient();
const DEFAULT_NODE = 'http://localhost:26657';

function App() {
  const [node, setNode] = useLocalStorage('agoricnode', DEFAULT_NODE);
  const [currentNode, setCurrentNode] = useState(node);

  const saveNode = (e: FormEvent) => {
    e.preventDefault();
    setNode(currentNode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <form onSubmit={saveNode}>
        Node:
        <div>
          <input value={currentNode} onChange={(e) => setCurrentNode(e.target.value)} className={s.nodeInput} />
          <button type="submit">Save</button>
        </div>
      </form>
      <KeyTree path="" node={node} key={node} />
    </QueryClientProvider>
  );
}

export default App;
