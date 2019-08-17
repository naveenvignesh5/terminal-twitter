const keytar = require('keytar');

const login = async () => {
    try {
        let token = await keytar.getPassword('twitter-cmd', 'default');

        if (token) return token;
        
        axios.post('/oauth/request_token')
    } catch (err) {
        
    }
}

login();
