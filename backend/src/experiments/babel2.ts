import * as fs from 'fs';
import * as babel from '@babel/core';
import { NodePath } from '@babel/traverse';
import * as parser from '@babel/parser';
import presetEnv from '@babel/preset-env';
import * as presetTypescript from '@babel/preset-typescript';
import * as pluginTransformTypescript from '@babel/plugin-transform-typescript';
import * as traverse from '@babel/traverse';
// Define a structure to store function and method information
interface FunctionInfo {
    name: string;
    params: string[];
    body: string;
}

const entryFile = '/home/harsh/chat-stocks/test_app/src/fruit_api.ts';
const code = fs.readFileSync(entryFile, 'utf-8');

const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript'],
});

// Function to extract function and method information
function extractFunctionsAndMethods(ast: babel.types.Node): FunctionInfo[] {
    const functions: FunctionInfo[] = [];

    traverse.default(ast, {
        FunctionDeclaration(path: NodePath<babel.types.FunctionDeclaration>) {
                console.log(JSON.stringify(path.node.body, null, 2))
            if (path.parent.type === 'Program' && path.node.id) {
                //         // Generate code for the function body
                //         const code  = babel.transformFromAstSync(path.node.body, null, {
                //           filename: '/path/to/your/file.js', // Provide a filename for transformation
                //           presets: ['@babel/preset-env'],
                //           plugins: [],
                //         })?.code ?? null;
                //         // Stop traversing once the specific function is found
                //         functions.push(code);


                const generatedCode = babel.transformFromAstSync(
                    babel.types.file(babel.types.program([path.node])),
                    null,
                    { ast: true }
                );
                console.log(generatedCode.code);
            }
        },
        // FunctionExpression(path: NodePath<babel.types.FunctionExpression>) {
        //   if (path.parent.type === 'Program' && path.node.id) {
        //     const name = path.node.id.name;
        //     const params = path.node.params.map(param => (param as babel.types.Identifier).name);
        //     const body = babel.transformFromAstSync(path.node.body, null, {
        //       presets: [presetEnv, presetTypescript],
        //       plugins: [pluginTransformTypescript],
        //     })?.code ?? '';
        //     functions.push({ name, params, body });
        //   }
        // },
        // ClassMethod(path: NodePath<babel.types.ClassMethod>) {
        //   const methodName = path.node.key.name;
        //   const classNode = path.findParent(parentPath => parentPath.isClassDeclaration());
        //   if (classNode) {
        //     const className = (classNode.node.id as babel.types.Identifier | null)?.name || 'UnknownClass';
        //     const params = path.node.params.map(param => (param as babel.types.Identifier).name);
        //     const body = babel.transformFromAstSync(path.node.body, null, {
        //       presets: [presetEnv, presetTypescript],
        //       plugins: [pluginTransformTypescript],
        //     })?.code ?? '';
        //     functions.push({ name: `${className}.${methodName}`, params, body });
        //   }
        // },
        // Decorator(path: NodePath<babel.types.Decorator>) {
        //   const decoratorName = babel.transformSync(path.node.expression)?.code;
        //   const classNode = path.findParent(parentPath => parentPath.isClassDeclaration());
        //   if (classNode) {
        //     const className = (classNode.node.id as babel.types.Identifier | null)?.name || 'UnknownClass';
        //     functions.push({ name: `@${decoratorName}(${className})`, params: [], body: '' });
        //   }
        // },
    });

    return functions;
}

// Extract functions and methods
const extractedFunctions = extractFunctionsAndMethods(ast);

// Print out the extracted information
extractedFunctions.forEach((fn, index) => {
    console.log(`Function/Method ${index + 1}:`);
    console.log(`Name: ${fn.name}`);
    console.log(`Params: ${fn.params.join(', ')}`);
    console.log(`Body: ${fn.body}`);
    console.log('----------------------');
});
