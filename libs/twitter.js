const Twitter = require('twitter');
const { logError, logInfo } = require('./cmd');

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
            if (error) logError(error)

            if (!error) logInfo(tweet);
        });
    }
}

module.exports = twt;
