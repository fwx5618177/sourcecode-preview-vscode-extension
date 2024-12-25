const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : {
    postMessage: () => console.warn('postMessage: VSCode API not available'),
    setState: () => console.warn('setState: VSCode API not available'),
    getState: () => console.warn('getState: VSCode API not available'),
  };

export function postMessage(message: any) {
  vscode.postMessage(message);
}

export function setState(state: any) {
  vscode.setState(state);
}

export function getState() {
  return vscode.getState();
}