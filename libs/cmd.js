const chalk = require('chalk');

const log = console.log;

const logError = err => log(chalk.red.bold(err));

const logSuccess = message => log(chalk.green.bold(message));

const logInfo = info => log(chalk.blue.bold(info));

const logTweet = tweet => log(chalk.blue.bold(tweet.text), chalk.green(tweet.created_at), "by", chalk.cyan(tweet.user.screen_name));

module.exports = {
    logError,
    logSuccess,
    logInfo,
    logTweet,
};
