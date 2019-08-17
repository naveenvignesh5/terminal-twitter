const chalk = require('chalk');

const log = console.log;

const logError = err => log(chalk.red.bold(err));

const logSuccess = message => log(chalk.green.bold(message));

module.exports = {
    logError,
    logSuccess,
};
