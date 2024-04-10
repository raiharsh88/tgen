const fs = require('fs');
const path = require('path');

class EmitTypeScriptFilesPlugin {
    options;
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('EmitTypeScriptFilesPlugin', compilation => {
      const outputDir = this.options.outputDir || 'src/ast/dist';
      const files = Object.keys(compilation.assets);

      files.forEach(filename => {
        const outputFile = path.resolve(outputDir, filename);

        if (filename.endsWith('.js')) {
          const sourceSize = compilation.assets[filename].size();
          if (sourceSize > 0) {
            const source = fs.readFileSync(outputFile, 'utf8');
            const tsOutput = this.convertToTypeScript(source);
            fs.writeFileSync(outputFile.replace('.js', '.ts'), tsOutput);
          }
        }
      });
    });
  }

  convertToTypeScript(source) {
    // Replace .js extension with .ts
    return source.replace(/\.js/g, '.ts');
  }
}



export { EmitTypeScriptFilesPlugin };
