const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios');
const open = require('opn');
const inquirer = require('inquirer');
const keytar = require('keytar');

const { logError, logSuccess } = require('./cmd');
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = require('../api.json');

const prompt = inquirer.createPromptModule();

const baseOAuthUrl = 'https://api.twitter.com/oauth'
const oauth_callback = 'http://naveenvignesh.xyz/twitterBotAuthRedirect';

const request_data = {
    url: `${baseOAuthUrl}/request_token`,
    method: 'POST',
    data: { oauth_callback },
};


const login = async () => {
    const cred = JSON.parse(await keytar.getPassword('twitter-cmd-tool', 'default')) || {};

    if (cred.user_access_token && cred.user_access_token_secret) {
        logSuccess('Already logged in.');
        return;
    }

    const consumer_key = TWITTER_CONSUMER_KEY;

    const oauth = OAuth({
        consumer: { key: consumer_key, secret: TWITTER_CONSUMER_SECRET },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64');
        },
    });

    try {
        // 1. Getting request token
        let res = await axios.post(`${baseOAuthUrl}/request_token`, {}, { headers: oauth.toHeader(oauth.authorize(request_data, {}))});
        let token = res.data.split('&')[0].split('=')[1];

        // 2. Openning authenticate url in browser to authorize application
        await open(`${baseOAuthUrl}/authenticate?oauth_token=${token}&force_login=true`);

        // 3. Getting oauth_token, oauth_token_secret from user which is visible in redirect url
        let { oauth_token, oauth_token_secret } = await prompt([
            {
                type: 'input',
                name: 'oauth_token',
                message: 'Please enter the oauth_token',
            },
            {
                type: 'input',
                name: 'oauth_token_secret',
                message: 'Please enter the oauth_token_secret',
            }
        ]);
        
        keytar.setPassword(
            'twitter-cmd-tool',
            'default',
            JSON.stringify({
                user_access_token: oauth_token,
                user_access_token_secret: oauth_token_secret,
            }),
        );

        logSuccess('Logged in successfully');
    } catch (err) {
        logError(JSON.stringify(err));
    }
};

const logout = async () => {
    try {
        await keytar.deletePassword('twitter-cmd-tool', 'default');
        logSuccess('Logged out.');
    } catch (err) {
        logError(err);
    }
};

module.exports = {
    login,
    logout,
};