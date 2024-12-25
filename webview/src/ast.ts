import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

// 使用 Acorn 解析代码为 AST
export function parseCodeToAST(code: string) {
  try {
    return acorn.Parser.extend(jsx()).parse(code, {
      ecmaVersion: 'latest',
      sourceType: 'module',
    });
  } catch (error) {
    console.error('AST Parsing Error:', error);
    return null;
  }
}