import React from "react"
import { Container, NavItem } from "react-bootstrap"

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var querystring = require('querystring');
var client_id = 'c9815be2d35041f69712acba82f994b9'; // Your client id
var client_secret = '7b7db31553ad466e9cac3c24a3890bce'; // Your secret
var redirect_uri = 'http://localhost:3000/'; // Your redirect uri
var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify';
var state = generateRandomString(16);

const AUTH_URL = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state})
// const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=c9815be2d35041f69712acba82f994b9&response_type=code&redirect_uri=http://localhost:3000/&scope=streaming%20"

export default function Login() {
    return <div>
        <a href={AUTH_URL}>
            <button>Login to Spotify</button>
        </a>
    </div>
}