#!/usr/bin/env node
const program = require('commander');
const keytar = require('keytar');
const { login, logout } = require('./libs/auth');
const twt = require('./libs/twitter');

const pkgVersion = require('./package.json').version;

require('dotenv').config();

let twitter = null;

program
    .version(pkgVersion)
    .option('-l, --login', 'Login to twitter account')
    .option('-t, --tweet [value]')
    .option('-f, --favorite')
    .option('-F, --file [value]')
    .option('--logout', 'Logout from application')
    .parse(process.argv);

if (program.login) login();

if (program.logout) logout();

if (program.tweet) {
    keytar.getPassword('twitter-cmd-tool', 'default').then((cred) => {
        
        if (!cred) {
            login();
            return;
        }

        twitter = new twt(JSON.parse(cred));

        if (program.favorite) {
            twitter.favoriteTweets();
            return;
        }

        twitter.tweet(program.tweet);
    });
}
