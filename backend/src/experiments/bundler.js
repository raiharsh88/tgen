import { cpus } from 'os';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'jest-worker';
import chalk from 'chalk';
import fs from 'fs';
import JestHasteMap from 'jest-haste-map';
import Resolver from 'jest-resolve';
import yargs from 'yargs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../test_app');
console.log(root)
const hasteMapOptions = {
  extensions: ['ts'],
  maxWorkers: cpus().length,
  name: 'jest-bundler',
  platforms: [],
  rootDir: root,
  roots: [root],
};


main()

async function main() {

  const hasteMap = new JestHasteMap.default(hasteMapOptions);
  await hasteMap.setupCachePath(hasteMapOptions);
  const { hasteFS, moduleMap } = await hasteMap.build();

  const options = yargs(process.argv).argv;
  const entryPoint = resolve(process.cwd(), options.entryPoint);
  console.log(entryPoint)
  if (!hasteFS.exists(entryPoint)) {
    throw new Error(
      '`--entry-point` does not exist. Please provide a path to a valid file.',
    );
  }

  console.log(chalk.bold(`❯ Building ${chalk.blue(options.entryPoint)}`));

  const resolver = new Resolver.default(moduleMap, {
    extensions: ['.ts'],
    hasCoreModules: false,
    rootDir: root,
  });

  const seen = new Set();
  const modules = new Map();
  const queue = [entryPoint];
  let id = 0;
  while (queue.length) {
    const module = queue.shift();
    if (seen.has(module)) {
      continue;
    }
    seen.add(module);
    console.log('Module ', module)  
    console.log('Dependencies ',  hasteFS.getDependencies(module))
    const dependencyMap = new Map(
      hasteFS
        .getDependencies(module)
        .map((dependencyName) => [
          dependencyName,
          dependencyName[0] == '.'?resolver.resolveModule(module, dependencyName) :resolver.resolveModuleFromDirIfExists(module, `${root}/node_modules/`+dependencyName),
        ]),
    );
    console.log(dependencyMap)
    const code = fs.readFileSync(module, 'utf8');
    const metadata = {
      id: id++,
      code,
      dependencyMap,
    };
    modules.set(module, metadata);
    queue.push(...dependencyMap.values());
  }

  console.log(chalk.bold(`❯ Found ${chalk.blue(seen.size)} files`));

  console.log(chalk.bold(`❯ Serializing bundle`));
  const wrapModule = (id, code) =>
    `define(${id}, function(module, exports, require) {\n${code}});`;

  const worker = new Worker(
    join(dirname(fileURLToPath(import.meta.url)), 'worker.js'),
    {
      enableWorkerThreads: true,
    },
  );

  const results = await Promise.all(
    Array.from(modules)
      .reverse()
      .map(async ([module, metadata]) => {
        let { id, code } = metadata;
        ({ code } = await worker.transformFile(code));
        for (const [dependencyName, dependencyPath] of metadata.dependencyMap) {
          const dependency = modules.get(dependencyPath);
          code = code.replace(
            new RegExp(
              `require\\(('|")${dependencyName.replace(/[\/.]/g, '\\$&')}\\1\\)`,
            ``),
            `require(${dependency.id})`,
          );
        }
        return wrapModule(id, code);
      }),
  );

  const output = [
    fs.readFileSync('./require.js', 'utf8'),
    ...results,
    'requireModule(0);',
  ].join('\n');

  console.log(output);

  if (options.output) {
    fs.writeFileSync(options.output, output, 'utf8');
  }

  worker.end();
}