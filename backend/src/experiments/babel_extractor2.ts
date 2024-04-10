import * as 
 babel from '@babel/core';
import fs from 'fs'
// Read the JavaScript file
const entryFile = '/home/harsh/chat-stocks/backend/src/test_app/app.ts'

const code = fs.readFileSync(entryFile, 'utf-8');

// Babel plugin to extract expressions and their dependencies
const extractExpressionsPlugin = function () {
    const imports:any[] = []
  return {
    visitor: {
        ImportDeclaration(path:any) {
            const source = path.node.source.value;
            const specifiers = path.node.specifiers.map((specifier:any) => specifier.local.name);
    
            imports.push({ source, specifiers });
          },
      ExpressionStatement(path:any) {
        const { node } = path;
        // Check if the expression is a CallExpression
        if (node.expression.type === 'CallExpression' &&path.parentPath.type === 'Program' ) {
          const dependencies = node.expression.arguments.map((arg:any) => arg.value);

          // Extract the expression block
          const expressionBlock = code.substring(node.start, node.end);

          // Output the expression block and its dependencies
          console.log('Expression Block:', expressionBlock);
          console.log('Dependencies:', dependencies);
          console.log('------------------------');
        }
      },

      Program: {
        exit() {
          // Output imports and their dependencies
          imports.forEach(importInfo => {
            console.log('Source:', importInfo.source);
            console.log('Specifiers:', importInfo.specifiers);
            console.log('------------------------');
          });
        },
      },
    },
  };
};

// Use Babel to parse and transform the code
babel.transform(code, {
    "presets":  ["@babel/preset-env", "@babel/preset-typescript"],
    filename:entryFile,
  plugins: [extractExpressionsPlugin],
});
