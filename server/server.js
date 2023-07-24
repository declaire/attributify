const express = require('express');
const spotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');

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
        clientId: 'c9815be2d35041f69712acba82f994b9',
        clientSecret: '7b7db31553ad466e9cac3c24a3890bce',
        redirectUri: 'http://localhost:3000/',
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
        clientId: 'c9815be2d35041f69712acba82f994b9',
        clientSecret: '7b7db31553ad466e9cac3c24a3890bce',
        redirectUri: 'http://localhost:3000/'
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