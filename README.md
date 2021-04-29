# walk-from-entry

Walk through a monorepo to execute commands like `npm run build` `npm run test`, provides multiple modes such as `--fast`, `--full`, `--incremental, -inc`

## Synopsis

`npx walk-from-entry <command> [command-arg]...`

- `<command>`: build, test, lint...
- `[command-arg]`: --fast, --full, --incremental/-inc

## Usage

1. Switch to your entry directory.
2. run the command `npx walk-from-entry build -inc`

> The above command is equivalent to incrementally executing `npm run build` across all dependencies packages in the monorepo.

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

### [command-arg]

- `--fast` - only for no dist dependencies, if you execute `npx walk-from-entry build --fast`, it will just build the packages that have no dist folder.

- `--full` - fully execute the command.
- `-inc, --incremental` - incrementally execute the command. The mode defaults to be`--incremental`. ie, `npx walk-from-entry build` is equivalent to `npx walk-from-entry build --incremental` or `npx walk-from-entry build -inc`. The mechanism of the incremental build is generating a source code hash file `__hash.json` in dist folder. Once run it again, compare the previous one and the current one, to determine building it or skip.

## License

[MIT](https://github.com/licaomeng/walk-from-entry/blob/master/LICENSE)
