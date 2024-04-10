import { ESLint } from 'eslint';
import fs from 'fs';
import * as path from 'path';
import noUnusedClassMember from './custom-rules/no-unused-class-member';
import noUnusedClassMemberPlugin from './plugins/no-unused-class-member-plugin';

async function lintFiles(entryFile: string) {
  // Create an ESLint instance
  const eslint = new ESLint({
        rulePaths:['./'],
        // rulePaths:['./dist'],

        overrideConfig: {
          extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
          parser: '@typescript-eslint/parser',
          parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
          },
          plugins: ['@typescript-eslint','custom-rules'],
          rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            "no-unused-class-member":"error"
            // '@typescript-eslint/no-unused-class-members': 'error',
            //    '@typescript-eslint/ban-ts-comment': 'off',
          },
        },
    
  });

  try {
    const files = await getFiles(entryFile);
    const results = await eslint.lintFiles(files);
    console.log(results[0]);
    // Output linting results
    // for (const result of results as any) {
    // //   console.log(`File: ${result.filePath}`);
    // //   console.log(ESLint.getErrorResults(result) || 'No linting errors');
    // }
  } catch (error) {
    console.error('Error occurred while linting files:', error);
  }
}
async function getFiles(dir: string): Promise<string[]> {
    // return [dir];
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}
// Example usage
lintFiles('/home/harsh/chat-stocks/test_app/src');
