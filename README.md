sourcecode-preview-vscode-extension
├── .vscode/                             # VSCode 调试配置
│   └── launch.json                      # 启动插件的调试配置
├── package.json                         # 项目依赖和脚本
├── tsconfig.json                        # TypeScript 配置
├── vite.config.ts                       # Vite 配置 (Webview)
├── src/                                 # 插件主进程 (Node.js 环境)
│   └── extension.ts                     # VSCode 插件主入口
└── webview/                             # Webview 前端
    ├── index.html                       # Webview HTML 入口
    ├── tsconfig.json                    # Webview TS 配置
    ├── vite-env.d.ts                    # Vite 环境类型声明
    ├── src/                             # Webview 源代码
    │   ├── main.tsx                     # Webview 入口 (挂载 React)
    │   ├── App.tsx                      # Webview 主组件
    │   ├── DependencyGraph.tsx          # 文件依赖关系图组件
    │   ├── FlowChart.tsx                # AST 流程图组件
    │   ├── ast.ts                       # AST 解析逻辑
    │   └── style.scss                   # 全局样式
    └── dist/                            # Vite 构建产物 (HTML, JS, CSS)
        ├── index.html
        ├── assets/