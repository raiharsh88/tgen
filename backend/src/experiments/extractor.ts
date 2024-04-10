import * as ts from 'typescript';
import * as vfs from "@typescript/vfs"
import fs from 'fs';
import * as parser from '@babel/parser'


function extractAST(fileName:string) {
    console.log('Extracting ast1')

    const sourceCode = fs.readFileSync(fileName, "utf-8");
    // Parse the TypeScript code into a syntax tree
    const sourceFile = ts.createSourceFile(
      fileName,
      sourceCode,
      ts.ScriptTarget.Latest,
      /* setParentNodes */ false
    );
    return sourceFile;
}
  // Example usage:

function extractASTBabel(fileName:string) {
  console.log('Extracting ast2')

  const sourceCode = fs.readFileSync(fileName, "utf-8");
  // Parse the TypeScript code into a syntax tree
  const ast = parser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['typescript']
  });
  return ast;
}
export function extractor(){
  const fileName = "/home/harsh/chat-stocks/backend/src/test_app/routes/users/users.controller.ts"; // Replace with your TypeScript file
  // const ast = extractAST(fileName);

  const ast = extractASTBabel(fileName);

  console.log(JSON.stringify(ast, null, 2));

  fs.writeFileSync('./src/ast/samples/dump1.json',JSON.stringify(ast, null, 2) )
  console.log(JSON.stringify(ast, null, 2));
  return ast
}


function readDump(fileName:string) {
    const sourceCode = fs.readFileSync(fileName, "utf-8");
    // Parse the TypeScript code into a syntax tree


    const ast = JSON.parse(sourceCode);

    console.log(ts.SyntaxKind[ast.kind])
    ast.statements.forEach((node:any) => {
      console.log(ts.SyntaxKind[node.kind])
    })
}


// readDump('./src/ast/samples/dump1.json')