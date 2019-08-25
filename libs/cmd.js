const chalk = require('chalk');

const log = console.log;

const logError = err => log(chalk.red.bold(err));

const logSuccess = message => log(chalk.green.bold(message));

const logInfo = info => log(chalk.blue.bold(info));

const logTweet = (tweet) => {
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

    let tweetText = tweet.text;

    if (tweet.truncated && tweet.extended_tweet) {
        tweetText = tweet.extended_tweet.full_text;
    }

    log(chalk.blue.bold(tweetText), "by", chalk.cyan(tweet.user.screen_name), chalk.green(dformat), '\n');
};

module.exports = {
    logError,
    logSuccess,
    logInfo,
    logTweet,
};
