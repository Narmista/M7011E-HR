const https = require('https');
const app = require('./app');
const fs = require('fs');

const port = process.env.PORT || 3000;

const server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'hej123'
}, app);

server.listen(port);

