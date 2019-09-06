const chalk = require('chalk');
const axios = require('axios');
const terminalImage = require('terminal-image');

const log = console.log;

const logImage = async (imageUrl) => {
    try {
        let image = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        if (image.data) console.log(await terminalImage.buffer(image.data));
    } catch (err) {
        console.log(err.message);
    }
}

const logError = err => log(chalk.red.bold(err));

const logSuccess = message => log(chalk.green.bold(message));

const logInfo = info => log(chalk.blue.bold(info));

const logUser = (user, options = {}) => {
    log(
        chalk.blue.bold(user.screen_name),
        "aka",
        chalk.yellow.italic(user.name),
        "-",
        chalk.green(user.id),
        "-",
        chalk.red(user.description || "N/A"),
    );

    if (options.withImage) logImage(user.profile_image_url_https);
};

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
    logUser,
    logImage,
};
