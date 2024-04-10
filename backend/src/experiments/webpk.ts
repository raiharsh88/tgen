import path from 'path';
import webpack from 'webpack';
import prettier from 'prettier';
import fs from 'fs';


console.log(__dirname);

function bundleTypeScript(entryFile: string, outputFile: string, outputDir: string): Promise<void> {
  const config: webpack.Configuration = {
    entry: entryFile,
    target: 'node',
    output: {
      filename: outputFile,
      path: path.resolve(__dirname, outputDir),
    },
    resolve: {
      extensions: ['.ts'],
    },
    context: '/home/harsh/chat-stocks/backend',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                compilerOptions: {
                  module: 'es6',
                },
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
  };

  return new Promise<void>((resolve, reject) => {
    webpack(config, async (err, stats) => {
      if (err || stats?.hasErrors()) {
        console.error(err || stats?.compilation.errors);
        reject(err || stats?.compilation.errors);
      } else {
        console.log(stats?.toString({
          colors: true,
          modules: false,
          chunks: false,
          chunkModules: false,
          children: false,
          entrypoints: false,
          warnings: false,
        }));

        // Read the output file
        const outputFileContent = fs.readFileSync(path.resolve(__dirname, outputDir, outputFile), 'utf8');

        // Format the output file using prettier
        const formattedCode = await prettier.format(outputFileContent, {
          parser: 'typescript',
        });

        // Write the formatted code back to the output file
        fs.writeFileSync(path.resolve(__dirname, outputDir, outputFile), formattedCode, 'utf8');

        resolve();
      }
    });
  });
}

// Example usage
const entryFile = '/home/harsh/chat-stocks/test_app/src/fruit_api.ts';
bundleTypeScript(entryFile, 'bundle.js', 'dist')
  .then(() => {
    console.log('Bundle created successfully.');
  })
  .catch(error => {
    console.error('Bundle creation failed:', error);
  });
