import fs from 'fs';
import * as recast from 'recast';


const {types:t, visit }  = recast
// Read the content of the appleHandler.ts file
const entryFile = '/home/harsh/chat-stocks/test_app/src/fruit_api.ts';

const appleHandlerCode = fs.readFileSync(entryFile, 'utf8');

// Parse the code into an AST
const appleHandlerAST = recast.parse(appleHandlerCode, { parser: require("recast/parsers/typescript") });

// Variables to track scope and dependencies
const scopedVariables = new Map<string, { parent: any, function?: string }>();

// Function to recursively traverse the AST and update scopedVariables
function traverseAndExtractVariables(node: any, parentScope: any): void {
  if ((t as any).isVariableDeclaration(node)) { // Type assertion
    node.declarations.forEach((declaration: any) => {
      scopedVariables.set(declaration.id.name, parentScope);
    });
  } else if ((t as any).isIdentifier(node)) { // Type assertion
    if (!scopedVariables.has(node.name)) {
      // If the identifier is not found in the current scope, check parent scopes
      if (parentScope) {
        traverseAndExtractVariables(node, parentScope.parent);
      }
    }
  } else if ((t as any).isBlockStatement(node) || (t as any).isProgram(node)) { // Type assertion
    // Create a new scope for BlockStatement or Program
    node.body.forEach((childNode: any) => {
      traverseAndExtractVariables(childNode, { parent: parentScope });
    });
  } else if ((t as any).isFunctionDeclaration(node)) { // Type assertion
    // Create a new scope for FunctionDeclaration
    const functionName = node.id.name;
    node.params.forEach((param: any) => {
      scopedVariables.set(param.name, { parent: parentScope, function: functionName });
    });
    traverseAndExtractVariables(node.body, { parent: parentScope, function: functionName });
  } else {
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key) && typeof node[key] === 'object' && node[key] !== null) {
        traverseAndExtractVariables(node[key], parentScope);
      }
    }
  }
}

// Traverse the AST to extract variables and their scopes
traverseAndExtractVariables(appleHandlerAST, null);

// Extract import declarations and function declarations related to apple
const appleFunctions: { [key: string]: string } = {};
visit(appleHandlerAST, {
  visitImportDeclaration(path:any) {
    const importSource:any = path.node.source.value;
    if (importSource.includes('apple')) {
      appleFunctions[path.node.source.value] = path.node.specifiers.map((specifier: any) => specifier.local.name);
    }
    return false;
  },
  visitFunctionDeclaration(path:any) {
    const functionName = path.node.id.name;
    if (appleFunctions[functionName]) {
      appleFunctions[functionName] = recast.print(path.node).code;
    }
    return false;
  }
});

// Generate the combined file content with scoped variables
let combinedCode = '';
scopedVariables.forEach((scope, variable) => {
  if (!scope.parent) {
    // Global variable
    combinedCode += `const ${variable}: any = undefined;\n`;
  } else if (scope.function) {
    // Variable scoped to a function
    combinedCode += `const ${variable}: any = undefined;\n`;
  } else {
    // Variable scoped to a block
    combinedCode += `const ${variable}: any = undefined;\n`;
  }
});
combinedCode += '\n'; // Add a newline for readability
combinedCode += `${Object.values(appleFunctions).join('\n')}\n`;

// Write the combined code to a new file
fs.writeFileSync('combinedAppleFunctions.ts', combinedCode, 'utf8');
