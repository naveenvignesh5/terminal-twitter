const Twitter = require('twitter');
const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');

const { generateOAuthHeader } = require('./auth');
const { logError, logTweet, logInfo, logUser } = require('./log');

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = require('../api.json');

const TWITTER_BASE_URL = 'https://api.twitter.com/1.1';

class twt {
    constructor(cred) {
        this.client = new Twitter({
            consumer_key: TWITTER_CONSUMER_KEY,
            consumer_secret: TWITTER_CONSUMER_SECRET,
            access_token_key: cred.user_access_token,
            access_token_secret: cred.user_access_token_secret,
        });
    }

    tweet(status) {
        this.client.post('statuses/update', { status }, function(error, tweet, response) {
            if (error) logError(JSON.stringify(error));

            if (!error) logTweet(tweet);
        });
    }

    tweetWithMedia(status, media) {
        let data = fs.readFileSync(media);

        let cl = this.client;

        cl.post('media/upload', { media: data }, function(error, media, response) {
            if (error) {
                logError(error);
                return;
            }

            let statusBody = {
                status,
                media_ids: media.media_id_string, // pass the media id string
            };

            cl.post('statuses/update', statusBody, function(error, tweet, response) {
                if (error) {
                    logError(JSON.stringify(error));
                    return;
                }

                logTweet(tweet, { withMedia: true });
            });
        });
    }

    favoriteTweets() {
        this.client.get('favorites/list', function(error, tweets, response) {
            if (error) {
                logError(error);
                return;
            }

            tweets.forEach(tw => {
                logInfo(JSON.stringify(tw.text));
            });
        });
    }

    searchTweets(q) {
        this.client.get('search/tweets', { q }, function (error, tweets, response) {
            if (error) {
                logError(error);
                return;
            }

            tweets.statuses.forEach(tw => {
                logTweet(tw);
            });
        });
    }

    trackTweet(track) {
        this.client.stream('statuses/filter', { track, tweet_mode:'extended' }, function (stream) {
            stream.on('data', function (tweet) {
                logTweet(tweet);
            });

            stream.on('error', function (error) {
                logError(error.message);
            });
        });
    }

    async getFollowersList(screen_name) {
        let reqData= {
            url: `${TWITTER_BASE_URL}/followers/list.json?screen_name=${screen_name}`,
            method: 'GET',
        };

        try {
            let headers = await generateOAuthHeader(reqData);

            const res = await axios({
                url: reqData.url,
                method: reqData.method,
                headers,
            });
            
            res.data.users.forEach(user => {
                logUser(user);
            });

            console.log(
                "\n",
                chalk.italic.red("Number of followers"),
                "-",
                chalk.blue.bold(res.data.users.length)
            );
        } catch (err) {
            logError(JSON.stringify(err.response.data) || "Something went wrong !!!");
        }
    }

    async getFriendsList(screen_name) {
        let reqData = {
            url: `${TWITTER_BASE_URL}/friends/list.json?screen_name=${screen_name}`,
            method: 'GET',
        };

        try {
            let headers = await generateOAuthHeader(reqData);

            const res = await axios({
                url: reqData.url,
                method: reqData.method,
                headers,
            });

            res.data.users.forEach(user => {
                logUser(user);
            });
        } catch (err) {
            logError(JSON.stringify(err.response.data) || "Something went wrong !!!");
        }
    }

    async getFriendRequests() {
        let reqData = {
            url: `${TWITTER_BASE_URL}/friendships/incoming.json`,
            method: 'GET',
        };

        try {
            let headers = await generateOAuthHeader(reqData);

            const res = await axios({
                url: reqData.url,
                method: reqData.method,
                headers,
            });

            let requestIds = res.data.ids;

            if (requestIds.length === 0) {
                logInfo('No friend requests available.');
                return;
            }

            requestIds.forEach(id => {
                chalk.blue.bold(id);
            });
        } catch (err) {
            logError(JSON.stringify(err.response.data) || "Something went wrong !!!");
        }
    }
}

module.exports = twt;
