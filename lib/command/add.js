'use strict';

const path = require('path');
const fs = require('mz/fs');
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const BaseCommand = require('../base_command');

class AddCommand extends BaseCommand {

  async _run(_, [ repo ]) {
    repo = this.normalizeRepo(repo);
    const key = this.url2dir(repo);
    const base = await this.chooseBaseDirectory();
    const targetPath = path.join(base, key);
    this.logger.info('Start adding repository %s', chalk.green(repo));

    if (await fs.exists(targetPath)) {
      this.logger.info(`${targetPath} already exist`);
      await this.copyPath(targetPath);
      return;
    }

    await this.addRepo(repo, targetPath);

    if (await this.changeDirectory(targetPath)) return;

    await this.copyPath(targetPath);
  }

  normalizeRepo(repo) {
    const alias = this.config.alias;
    const keys = Object.keys(alias);
    for (const key of keys) {
      // github://ying-bin/projj -> https://github.com/ying-bin/projj.git
      if (repo.startsWith(key)) {
        repo = alias[key] + repo.substring(key.length) + '.git';
        break;
      }
    }
    return repo;
  }

  async copyPath(targetPath) {
    try {
      await clipboardy.write(`cd ${targetPath}`);
      this.logger.info(chalk.green('📋  Copied to clipboard') + ', just use Ctrl+V');
    } catch (e) {
      this.logger.warn('Fail to copy to clipboard, error: %s', e.message);
    }
  }

  get description() {
    return 'Add repository';
  }

}

module.exports = AddCommand;
