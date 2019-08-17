const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios');
const open = require('opn');
const inquirer = require('inquirer');
const keytar = require('keytar');

const { logError, logSuccess } = require('./cmd');

const prompt = inquirer.createPromptModule();

const baseOAuthUrl = 'https://api.twitter.com/oauth'
const oauth_callback = 'http://naveenvignesh.xyz/twitterBotAuthRedirect';

const request_data = {
    url: `${baseOAuthUrl}/request_token`,
    method: 'POST',
    data: { oauth_callback },
};


const login = async () => {
    const cred = JSON.parse(await keytar.getPassword('twitter-cmd-tool', 'default',)) || {};

    if (cred.user_access_token && cred.user_access_token_secret) {
        logSuccess('Already logged in.');
        return;
    }

    const consumer_key = process.env.TWITTER_CONSUMER_KEY;

    const oauth = OAuth({
        consumer: { key: consumer_key, secret: process.env.TWITTER_CONSUMER_SECRET },
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
        await open(`${baseOAuthUrl}/authenticate?oauth_token=${token}`);

        // 2.a Getting oauth_token, oauth_verifier from user which is visible in redirect url
        let { oauth_token, oauth_verifier } = await prompt([
            {
                type: 'input',
                name: 'oauth_token',
                message: 'Please enter the oauth_token',
            },
            {
                type: 'input',
                name: 'oauth_verifier',
                message: 'Please enter the oauth_verifier',
            }
        ]);

        // 3. Getting user access token and user access token secret
        let res_access_token = await axios.post(`${baseOAuthUrl}/access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}&oauth_consumer_key=${consumer_key}`)

        let user_access_token = res_access_token.data.split('&')[0].split('=')[1];
        let user_access_token_secret = res_access_token.data.split('&')[1].split('=')[1];

        keytar.setPassword(
            'twitter-cmd-tool',
            'default',
            JSON.stringify({
                user_access_token,
                user_access_token_secret,
            }),
        );

        logSuccess('Logged in successfully');
    } catch (err) {
        logError(err.response.data);
    }
};

module.exports = {
    login,
};