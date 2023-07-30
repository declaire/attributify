const express = require('express');
const spotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('../config.js');

// const corsOptions = {
//     origin: 'http://localhost:3000/',
//     credentials: true,
//     optionsSuccessStatus: 200
// }

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refresh_token
    const spotifyApi = new spotifyWebApi({
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        redirectUri: config.REDIRECT_URI,
        refreshToken,
    })
    spotifyApi.refreshAccessToken().then(
        (data) => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        }).catch(err => {
            console.log(err);
            res.sendStatus(400);
        })   
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new spotifyWebApi({
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        redirectUri: config.REDIRECT_URI
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
})

app.listen(3001, () => {
    console.log('Listening on port 3001');
})