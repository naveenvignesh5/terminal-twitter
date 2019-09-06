#!/usr/bin/env node
const program = require('commander');
const keytar = require('keytar');
const { login, logout } = require('./libs/auth');
const { logError } = require('./libs/log');
const twt = require('./libs/twitter');

const pkgVersion = require('./package.json').version;

const run = async () => {
    try {
        let cred = await keytar.getPassword('terminal-twitter', 'default');

        if (!cred) {
            login();
            return;
        }
        
        let twitter = new twt(JSON.parse(cred));

        program
            .version(pkgVersion)
            .option('-t, --tweet [value]', 'Send a tweet')
            .option('-m, --media [value]', 'Upload media as tweet')
            .option('-T, --track [value]', 'Track a hashtag or user for updates')
            .option('-s, --search [value]', 'Search twitter for tweets, keywords, etc.')
            .option('--followers [value]', 'List your followers and followers of any other user')
            .option('--friends [value]', 'List your friends and friends of any other user')
            .option('-l, --login', 'Login to twitter account')
            .option('-f, --favorite', 'Favorite flag to be used along with tweet flag')
            .option('--requests', 'List friend requests')
            .option('--logout', 'Logout from application')
            .option('-c, --create')
            .option('-u, --update')
            .option('-d, --delete')
            .parse(process.argv);
        
        if (program.login) login();
        
        if (program.logout) logout();
        
        if (program.media) {
            if (!program.tweet) {
                logError("Required tweet text with media upload");
                return;
            }

            twitter.tweetWithMedia(program.tweet, program.media);
        }
        if (program.tweet) {
            
            if (program.favorite) {
                twitter.favoriteTweets();
                return;
            }

            twitter.tweet(program.tweet);
        }

        if (program.search) twitter.searchTweets(program.search);

        if (program.track) twitter.trackTweet(program.track);

        if (program.followers) {
            if (program.followers === '') program.followers = JSON.parse(cred).screen_name;
            twitter.getFollowersList(program.followers);
        }

        if (program.friends) {
            if (program.friends === '') program.friends = JSON.parse(cred).screen_name;
            twitter.getFriendsList(program.friends);
        }

        if (program.requests) twitter.getFriendRequests();
        
    } catch (err) {
        logError(err);
    }
};

run();
