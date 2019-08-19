const chalk = require('chalk');

const log = console.log;

const logError = err => log(chalk.red.bold(err));

const logSuccess = message => log(chalk.green.bold(message));

const logInfo = info => log(chalk.blue.bold(info));

module.exports = {
    logError,
    logSuccess,
    logInfo,
};
