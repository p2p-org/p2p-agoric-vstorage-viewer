import { useState, FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Viewer } from './Viewer';
import { useLocalStorage } from './utils';
import * as s from './App.module.css';
console.log(s);

const queryClient = new QueryClient();
const DEFAULT_NODE = 'https://xnet.rpc.agoric.net';

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
      <Viewer path="" node={node} key={node} />
    </QueryClientProvider>
  );
}

export default App;
