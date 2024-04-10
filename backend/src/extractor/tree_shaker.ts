import { ESLint } from 'eslint';

async function removeUnusedCode(sourceCode:string) {
    // sourceCode = `
    // import { unusedFunction } from './unused';
    // console.log('Hello world');
    // `;
    const eslint = new ESLint({
        overrideConfig: {
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module',
            },
            plugins: ['unused-imports', '@typescript-eslint'],
            rules: {
                // "no-unused-vars": "error",
                "unused-imports/no-unused-imports": "error",
                "@typescript-eslint/no-unused-vars":"off",
                "no-unused-vars":"off",
                "unused-imports/no-unused-vars": "error",
                // "remove-unused-variables": "error"
            }
        },
        fix: true,

    });

    try {
        // 2. Lint files. This doesn't modify target files.
        let results = await eslint.lintText(sourceCode);
    
        // 3. Modify the files with the fixed code.
        await ESLint.outputFixes(results);
        console.log(results.length)
        // return results[0].output
        const formatter = await eslint.loadFormatter("stylish");
        const resultText = formatter.format(results);

        console.log(results.map(x => x.messages.map(r => console.log(r))))
        // console.log(results[0].source)

        return results[0].output
     // Return the fixed code
    } catch (error) {
        console.error('Error occurred while linting files:', error);
        return null;
    }
}


export { removeUnusedCode };