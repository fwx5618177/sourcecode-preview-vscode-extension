import React, { useState, useEffect } from 'react';
import FlowChart from './FlowChart';
import DependencyGraph from './DependencyGraph';
import { postMessage } from './utils/vscodeApi';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [graphData, setGraphData] = useState(null);

  const handleParse = () => {
    postMessage({ command: 'parseDependencies' });
  };

  // 监听 VSCode 主进程发来的消息
  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data.command === 'dependencyData') {
        setGraphData(event.data.data);
      }
    });
  }, []);

  return (
    <div className="app-container">
      <h1>Code Visualization</h1>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        rows={10}
        cols={60}
      />

      <button onClick={handleParse}>Parse Project</button>

      {/* 渲染 AST 流程图 */}
      <FlowChart code={code} />

      {/* 渲染文件依赖关系图 */}
      <DependencyGraph graphData={graphData} />
    </div>
  );
};

export default App;