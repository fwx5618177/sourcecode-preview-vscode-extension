import * as vscode from 'vscode';
import * as acorn from 'acorn';
import * as fs from 'fs';
import * as path from 'path';

// 插件激活
export function activate(context: vscode.ExtensionContext) {
  // 注册 Webview 命令
  const disposable = vscode.commands.registerCommand('sourcecode-preview-vscode-extension.showDependencyGraph', () => {
    const panel = vscode.window.createWebviewPanel(
      'dependencyGraph',
      'Project Dependency Graph',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    // 读取 Vite 构建后的 HTML
    const webviewPath = path.join(context.extensionPath, 'webview', 'dist', 'index.html');
    panel.webview.html = fs.readFileSync(webviewPath, 'utf-8');

    // 监听 Webview 发来的消息
    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'parseDependencies') {
        const graph = await parseDependencyGraph();
        panel.webview.postMessage({ command: 'dependencyData', data: graph });
      }
    });
  });

  context.subscriptions.push(disposable);
}

// 解析项目依赖
async function parseDependencyGraph() {
  const projectPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
  const files = getFiles(projectPath, ['.ts', '.tsx', '.js', '.jsx']);
  const graph: { nodes: any[], links: any[] } = { nodes: [], links: [] };
  const fileMap: { [key: string]: any } = {};

  // 遍历项目文件并解析 AST
  files.forEach((file) => {
    const code = fs.readFileSync(file, 'utf-8');
    const ast = acorn.parse(code, { sourceType: 'module', ecmaVersion: 'latest' }) as any;

    const dependencies: string[] = [];
    traverseAST(ast, (node: any) => {
      if (node.type === 'ImportDeclaration') {
        const importedFile = path.resolve(path.dirname(file), node.source.value);
        dependencies.push(importedFile);
      }
    });

    const fileNode = { id: file, name: path.basename(file) };
    graph.nodes.push(fileNode);
    fileMap[file] = fileNode;

    dependencies.forEach((dep) => {
      if (fileMap[dep]) {
        graph.links.push({ source: file, target: dep });
      }
    });
  });

  return graph;
}

// 遍历 AST
function traverseAST(node: any, callback: (node: any) => void) {
  if (!node || typeof node !== 'object') return;
  callback(node);
  for (const key in node) {
    traverseAST(node[key], callback);
  }
}

// 获取项目文件
function getFiles(dir: string, exts: string[]): string[] {
  const files = fs.readdirSync(dir);
  let result: string[] = [];

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      result = result.concat(getFiles(fullPath, exts));
    } else if (exts.includes(path.extname(fullPath))) {
      result.push(fullPath);
    }
  });

  return result;
}