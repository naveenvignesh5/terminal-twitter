const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios');
const open = require('opn');
const inquirer = require('inquirer');
const keytar = require('keytar');

const { logError, logSuccess } = require('./log');
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
    const cred = JSON.parse(await keytar.getPassword('terminal-twitter', 'default')) || {};

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
        let res = await axios.post(`${baseOAuthUrl}/request_token`, {}, { headers: oauth.toHeader(oauth.authorize(request_data, {})) });

        let token = res.data.split('&')[0].split('=')[1];

        // 2. Openning authenticate url in browser to authorize application
        await open(`${baseOAuthUrl}/authenticate?oauth_token=${token}&force_login=true`);

        // 3. Getting oauth_token, oauth_token_secret from user which is visible in redirect url
        let { oauth_token, oauth_token_secret, screen_name } = await prompt([
            {
                type: 'input',
                name: 'screen_name',
                message: 'Please enter the screen name'
            },
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

        console.log(screen_name);

        keytar.setPassword(
            'terminal-twitter',
            'default',
            JSON.stringify({
                user_access_token: oauth_token,
                user_access_token_secret: oauth_token_secret,
                screen_name,
            }),
        );

        logSuccess('Logged in successfully');
    } catch (err) {
        logError(JSON.stringify(err));
    }
};

const logout = async () => {
    try {
        await keytar.deletePassword('terminal-twitter', 'default');
        logSuccess('Logged out.');
    } catch (err) {
        logError(err);
    }
};

const generateOAuthHeader = async (requestData) => {
    const cred = JSON.parse(await keytar.getPassword('terminal-twitter', 'default')) || {};

    if (!cred.user_access_token || !cred.user_access_token_secret) {
        login();
        return;
    }

    const oauth = OAuth({
        consumer: { key: TWITTER_CONSUMER_KEY, secret: TWITTER_CONSUMER_SECRET },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64');
        },
    });

    const token = {
        key: cred.user_access_token,
        secret: cred.user_access_token_secret,
    };

    return oauth.toHeader(oauth.authorize(requestData, token));
};

module.exports = {
    login,
    logout,
    generateOAuthHeader,
};