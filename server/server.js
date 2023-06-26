const express = require('express');
const spotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');

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

// var express = require('express'); // Express web server framework
// var request = require('request'); // "Request" library
// var cors = require('cors');
// var querystring = require('querystring');
// var cookieParser = require('cookie-parser');

// var client_id = 'c9815be2d35041f69712acba82f994b9'; // Your client id
// var client_secret = '7b7db31553ad466e9cac3c24a3890bce'; // Your secret
// var redirect_uri = 'http://localhost:3000/'; // Your redirect uri

// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
// var generateRandomString = function(length) {
//   var text = '';
//   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

// var stateKey = 'spotify_auth_state';

// var app = express();

// app.use(express.static(__dirname + '/public'))
//    .use(cors())
//    .use(cookieParser());

// app.get('/login', function(req, res) {

//   var state = generateRandomString(16);
//   res.cookie(stateKey, state);

//   // your application requests authorization
//   var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify';
//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }));
// });

// app.get('/callback', function(req, res) {

//   // your application requests refresh and access tokens
//   // after checking the state parameter

//   var code = req.query.code || null;
//   var state = req.query.state || null;
//   var storedState = req.cookies ? req.cookies[stateKey] : null;

//   if (state === null || state !== storedState) {
//     res.redirect('/#' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       }));
//   } else {
//     res.clearCookie(stateKey);
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {

//         var access_token = body.access_token,
//             refresh_token = body.refresh_token;

//         var options = {
//           url: 'https://api.spotify.com/v1/me',
//           headers: { 'Authorization': 'Bearer ' + access_token },
//           json: true
//         };

//         // use the access token to access the Spotify Web API
//         request.get(options, function(error, response, body) {
//           console.log(body);
//         });

//         // we can also pass the token to the browser to make requests from there
//         res.redirect('http:localhost:3000/#' +
//           querystring.stringify({
//             access_token: access_token,
//             refresh_token: refresh_token
//           }));
//       } else {
//         res.redirect('http:localhost:3000/#' +
//           querystring.stringify({
//             error: 'invalid_token'
//           }));
//       }
//     });
//   }
// });

// app.get('/refresh_token', function(req, res) {

//   // requesting access token from refresh token
//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// });

// console.log('Listening on 3001');
// app.listen(3001);