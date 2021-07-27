# walk-from-entry

Walk through a monorepo to execute commands like `npm run build` `npm run test`, provides multiple modes such as `--fast`, `--full`, `--incremental, -inc`

## Synopsis

`npx walk-from-entry <command> <command-mode> [command-arg]...`

- `<command>`: build, test, lint...
- `<command-mode>`: --fast, --full, --incremental/-inc (default to be --incremental/-inc)
- `[command-arg]`: --no-hash/-n

## Usage

1. Switch to your entry directory.
2. Run the command `npx walk-from-entry build`

> The above command is equivalent to incrementally executing `npm run build` across all dependencies packages in the monorepo (`npx walk-from-entry build --incremental`, `npx walk-from-entry build -inc`).

3. Create a `.walkignore` under the entry directory to ignore the path you'd like to skip. The `.walkignore` looks like:

```
*/**/foo*
*/**/bar*
*/**/baz*
```

> The ignore wildcard function leverage the open-source project [micromatch](https://github.com/micromatch/micromatch), for more matching feature detail, please see [here](https://github.com/micromatch/micromatch#matching-features).

## Description

### < command >

<command> can fill the slot `npm run <command>`

```json
"scripts": {
  "build": "...",
  "test": "...",
  "lint": "...",
},
```

### < command-mode >

- `--fast` - only for no dist dependencies, if you execute `npx walk-from-entry build --fast`, it will just build the packages that have no dist folder.
- `--full` - fully execute the command.
- `-inc, --incremental` - incrementally execute the command. The mode defaults to be`--incremental`. ie, `npx walk-from-entry build` is equivalent to `npx walk-from-entry build --incremental` or `npx walk-from-entry build -inc`. The mechanism of the incremental build is generating a source code hash file `__hash.json` in dist folder. Once run it again, compare the previous one and the current one, to determine building it or skip.

### [command-arg]

- `-n, --no-hash` - won't generate `__hash.json` in dist folder, applicable to idempotent commands like `lint`, `test`. Whereas `build`, `lint:fix` are not applicable.

## License

[MIT](https://github.com/licaomeng/walk-from-entry/blob/master/LICENSE)
