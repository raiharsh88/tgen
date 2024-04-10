// const babel = require('@babel/core')
import fs from 'fs';
import path from 'path';
import * as core from "@babel/core";
import { expressionStatement } from '@babel/types';


const entryFile = '/home/harsh/chat-stocks/backend/src/test_app/app.ts'
const sourceCode = fs.readFileSync(entryFile, 'utf-8');

core.transformAsync(sourceCode, {
    "presets":  ["@babel/preset-env", "@babel/preset-typescript"],
    filename:entryFile,
    
  plugins: [
    
    function ({ types: t }) {
      return {
        visitor: {
          ExpressionStatement(path:any) {

            // console.log(path)
            // const functionName = path.node.id.name;
            // const parameters = path.node.params.map((param:any) => param.name);
            // const body = path.node.body;

            // const dependencies = []; // Implement dependency extraction logic here
            // const functionCode = `
            //   function ${functionName}(${parameters.join(', ')}) {
            //     ${body}
            //   }
            // `;

            // console.log(`Extracted function: ${functionName}`);
            // fs.writeFileSync(`./output/${functionName}.js`, functionCode);
          },
        },
      };
    },
  ],

  ast: true,
  code:false
}).then(() => {
  console.log('Functions extracted successfully.');
}).catch((error:string) => {
  console.error('Error extracting functions:', error);
});


export function testQ(){
  
}