const app = require('express')();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

app.use('/static', express.static('public'));

//GET home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Login.html'));
});

// we will pass our 'app' to 'https' server
https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'hej123'
}, app)
.listen(443);