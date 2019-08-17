const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const axios = require('axios');
const open = require('opn');

const oauth = OAuth({
    consumer: { key: 'vADIxCVnamIVlyTc7TDSSShUc', secret: '93IQMqFXBCDEtNWpmL6klIcSYeSswGHe2OXRZSycVt5kUkDWt6' },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
});

const request_data = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: { oauth_callback: 'http://localhost/' },
};



console.log(oauth.toHeader(oauth.authorize(request_data, {})));

const login = async () => {
    try {
        let res = await axios.post('https://api.twitter.com/oauth/request_token', {}, { headers: oauth.toHeader(oauth.authorize(request_data, {}))});
        let token = res.data.split('&')[0].split('=')[1];

        await open(`https://api.twitter.com/oauth/authenticate?oauth_token=${token}`);
        // let res1 = await axios.get(`https://api.twitter.com/oauth/authenticate?oauth_token=${token}`);
        

    } catch (err) {
        console.log(err.response.data);
    }
};

login();