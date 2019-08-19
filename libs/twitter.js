const Twitter = require('twitter');
const { logError, logTweet } = require('./cmd');

class twt {
    constructor(cred) {
        this.client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
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
}

module.exports = twt;
