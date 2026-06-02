'use strict';

const chalk = require('chalk');
const clipboardy = require('clipboardy');
const BaseCommand = require('../base_command');

class FindCommand extends BaseCommand {

  async _run(cwd, [ repo ]) {
    if (!repo) {
      this.logger.error('Please specify the repo name:');
      this.childLogger.error(chalk.white('For example:'), chalk.green('projj find', chalk.yellow('example')));
      return;
    }
    const keys = await this.cache.getKeys();
    let matched = keys.filter(key => key.endsWith(repo.replace(/^\/?/, '/')));
    if (!matched.length) matched = keys.filter(key => key.indexOf(repo) >= 0);

    if (!matched.length) {
      this.logger.error('Can not find repo %s', chalk.yellow(repo));
      return;
    }
    let key;
    if (matched.length === 1) {
      key = matched[0];
    } else {
      const res = await this.choose(matched);
      key = res.key;
    }
    const dir = key;
    if (await this.changeDirectory(dir)) return;
    await this.copyPath(repo, dir);
  }

  async choose(choices) {
    return await this.prompt({
      name: 'key',
      type: 'list',
      message: 'Please select the correct repo',
      choices,
    });
  }

  async copyPath(repo, dir) {
    try {
      this.logger.info('find repo %s\'s location: %s', repo, dir);
      await clipboardy.write(`cd ${dir}`);
      this.logger.info(chalk.green('📋  Copied to clipboard') + ', just use Ctrl+V');
    } catch (e) {
      this.logger.warn('Fail to copy to clipboard, error: %s', e.message);
    }
  }

  get description() {
    return 'Find repository';
  }

}

module.exports = FindCommand;
