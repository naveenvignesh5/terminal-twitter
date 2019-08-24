const chalk = require('chalk');
const moment = require('moment');
const process = require('process');

const log = console.log;

const logError = err => log(chalk.red.bold(err));

const logSuccess = message => log(chalk.green.bold(message));

const logInfo = info => log(chalk.blue.bold(info));

const logTweet = (tweet, options) => {
    let d = new Date(tweet.created_at);

    let dformat = [
        d.getDate(),
        d.getMonth()+1,
        d.getFullYear()
    ].join('/') + ' ' + [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ].join(':');

    log(chalk.blue.bold(tweet.text), "by", chalk.cyan(tweet.user.screen_name), chalk.green(dformat));
};

module.exports = {
    logError,
    logSuccess,
    logInfo,
    logTweet,
};
