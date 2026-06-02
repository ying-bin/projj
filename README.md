# Projj

Manage git repositories by host, owner, and project name.

[![NPM version][npm-image]][npm-url]
[![Release Status][release-image]][release-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@ying-bin/projj.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@ying-bin/projj
[release-image]: https://github.com/ying-bin/projj/actions/workflows/release.yml/badge.svg
[release-url]: https://github.com/ying-bin/projj/actions/workflows/release.yml
[download-image]: https://img.shields.io/npm/dm/@ying-bin/projj.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ying-bin/projj

## Why?

If you clone many repositories by hand, duplicate names and scattered folders become annoying quickly. Projj keeps repositories in a predictable structure:

```text
$BASE
|- github.com
|  `- ying-bin
|     `- projj
`- gitlab.com
   `- ying-bin
      `- projj
```

It also lets you run configured hooks in one repository or across every cached repository.

## Features

- Add repositories with `projj add`
- Find repository paths with `projj find`
- Import existing repositories
- Sync cache entries with the filesystem
- Run custom hooks locally or across all repositories
- Use hook commands from `@ying-bin/projj-hooks`
- Show git clone progress during `projj add`

## Installation

Install Projj globally:

```bash
npm i -g @ying-bin/projj
```

Optional built-in hook commands are published separately:

```bash
npm i -g @ying-bin/projj-hooks
```

## Usage

### Initialize

```bash
projj init
```

This creates `~/.projj/config.json`. The default base directory is `~/projj`.

### Add Repository

```bash
projj add git@github.com:ying-bin/projj.git
```

The repository is cloned under the configured base directory and cached in `~/.projj/cache.json`.

Alias URLs are supported through the `alias` config:

```bash
projj add github://ying-bin/projj
```

By default, `github://` expands to `https://github.com/`.

### Find Repository

```bash
projj find projj
```

When a repository is found, Projj copies a `cd <path>` command to your clipboard.

If `change_directory` is set in `~/.projj/config.json`, Projj can ask the active macOS Terminal or iTerm window to change directory. On other platforms it falls back to copying the `cd` command.

### Import Repositories

Import repositories from an existing directory:

```bash
projj import ~/code
```

Recreate repositories from `~/.projj/cache.json`:

```bash
projj import --cache
```

### Sync Cache

```bash
projj sync
```

This removes cache entries whose repository directories no longer exist.

## Configuration

Projj stores configuration in `~/.projj/config.json`.

Example:

```json
{
  "base": "~/projj",
  "change_directory": false,
  "alias": {
    "github://": "https://github.com/"
  },
  "hooks": {}
}
```

`base` can also be an array. When multiple base directories are configured, Projj asks which one to use.

## Hook

Hooks are shell commands configured in `~/.projj/config.json`.

### Command Hooks

For `projj add`, Projj supports:

- `preadd`
- `postadd`

Example:

```json
{
  "hooks": {
    "postadd": "cat package.json"
  }
}
```

### Custom Hooks

Define a hook command:

```json
{
  "hooks": {
    "show_package": "cat package.json"
  }
}
```

Run it in the current directory:

```bash
projj run show_package
```

Run it in every cached repository:

```bash
projj runall show_package
```

### Built-in Hook Package

Install:

```bash
npm i -g @ying-bin/projj-hooks
```

Then configure hook commands such as:

```json
{
  "hooks": {
    "clean": "projj_clean",
    "dirty": "projj_dirty",
    "git_config_user": "projj_git_config_user"
  },
  "clean": {
    "node_modules": true,
    "git": true
  },
  "git_config_user": {
    "github.com": {
      "name": "your name",
      "email": "your email",
      "signingkey": "your signingkey"
    }
  }
}
```

Available hook commands include:

- `projj_clean`
- `projj_dirty`
- `projj_git_config_user`
- `projj_atom_project`
- `projj_vscode_project_manager`

### Write Your Own Hook

Any command available in `$PATH` can be used as a hook, including Bash scripts, Node.js scripts, and globally installed npm binaries.

Projj passes hook options through `PROJJ_HOOK_CONFIG`.

```js
#!/usr/bin/env node

'use strict';

const cp = require('child_process');
const config = JSON.parse(process.env.PROJJ_HOOK_CONFIG || '{}');

if (config.node_modules === true) {
  cp.spawn('rm', [ '-rf', 'node_modules' ]);
}
```

Configure it:

```json
{
  "hooks": {
    "clean": "clean"
  },
  "clean": {
    "node_modules": true
  }
}
```

## License

[MIT](LICENSE)
