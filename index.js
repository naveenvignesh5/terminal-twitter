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
    .option('--logout', 'Logout from application')
    .parse(process.argv);

if (program.login) login();

if (program.logout) logout();

if (program.tweet) {
    keytar.getPassword('twitter-cmd-tool', 'default').then((cred) => {
        twitter = new twt(JSON.parse(cred));
        twitter.tweet(program.tweet);
    });
}
