const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const chalk = require('chalk');
const entryDir = process.cwd();
const hash = require('./hash');
const tsconfigJSON = 'tsconfig.json';

const modeMap = {
  '--fast': 'fast',
  '--full': 'full',
  '--incremental': 'incremental',
  '-inc': 'incremental',
};

function getDepsFromEntry(entryDir) {
  const arr = [];
  function traverse(currDir) {
    // avoid overlap cases
    if (arr.includes(currDir)) {
      return arr;
    }
    const tsconfig = path.join(currDir, tsconfigJSON);
    // base case
    if (!fs.existsSync(tsconfig)) {
      return arr;
    }
    const obj = require(tsconfig);
    const refs = obj.references;
    const folders = refs
      .reduce((ret, item) => [...ret, item.path], [])
      .map(item => path.join(currDir, item));

    // Postorder Traversal
    folders.forEach(folder => {
      traverse(folder);
    });
    arr.push(...folders);

    return arr;
  }
  return traverse(entryDir);
}

function validateArgs(cmd, mode) {
  if (!cmd) {
    return chalk.red('The command cannot be empty!');
  }
  if (!modeMap[mode]) {
    return `${chalk.red('The mode should be one of the following:')}\n
    ${chalk.green('--fast, --full, --incremental/-inc')}`;
  }
}

async function exec(...args) {
  const [cmd, mode = '--incremental', ...opts] = args;
  const errMsg = validateArgs(cmd, mode);
  if (errMsg) {
    console.log(errMsg);
    return;
  }

  const deps = getDepsFromEntry(entryDir);
  const dirs = Array.from(new Set(deps));
  let count = 0;

  console.log(`start ${chalk.yellow(cmd)} from the entry path: ${chalk.blue(entryDir)}`);
  console.time('total time');

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    const dist = path.join(dir, 'dist');
    const src = path.join(dir, 'src');
    const __hashJson = path.join(dist, '__hash.json');
    const hashInfo = await hash(src);

    if (mode === '--fast') {
      if (fs.existsSync(dist)) {
        continue;
      }
    } else if (['--incremental', '-inc'].includes(mode)) {
      // no change
      if (
        fs.existsSync(dist) &&
        fs.existsSync(__hashJson) &&
        require(__hashJson).hash === hashInfo.hash
      ) {
        continue;
      }
    }
    cp.execSync(`npm run ${cmd}`, {
      cwd: dir,
      stdio: 'inherit',
    });
    if (fs.existsSync(dist) && !opts.includes('--no-hash') && !opts.includes('-n')) {
      fs.writeFileSync(__hashJson, JSON.stringify(hashInfo));
    }
    count++;
  }
  console.log(chalk.green(`${modeMap[mode]} ${cmd} done!`));
  console.log(chalk.yellow(count <= 1 ? `${count} package` : `${count} packages`));
  console.timeEnd('total time');
}

module.exports = exec;
