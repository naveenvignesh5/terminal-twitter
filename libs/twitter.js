const Twitter = require('twitter');
const fs = require('fs');
const { logError, logTweet } = require('./cmd');
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = require('../api.json');

class twt {
    constructor(cred) {
        console.log(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);

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

        this.client.post('media/upload', { media: data }, function(error, media, response) {
            if (error) {
                logError(error);
                return;
            }

            let statusBody = {
                status,
                media_ids: media.media_id_string, // pass the media id string
            };

            this.client.post('statuses/update', statusBody, function(error, tweet, response) {
                if (error) {
                    logError(JSON.stringify(error));
                    return;
                }

                logTweet(tweet);
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
}

module.exports = twt;
