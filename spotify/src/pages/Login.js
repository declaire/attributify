import React from "react"
import { Container, NavItem, Button } from "react-bootstrap"
import "./Index.css"

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
var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify playlist-modify-public playlist-modify-private playlist-read-private';
var state = generateRandomString(16);

const AUTH_URL = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state})

export default function Login() {
    return <div className="wrapper">
      <header className="header">
          <h1 className="text-center display-4" style={{fontSize:"100px"}}>Tempify</h1>
          <p className="text-center display-4" style={{fontSize:"20px"}}>A tempo-based playlist generator. Perfect for workouts, studying, sleep, and more.</p>
          <p className="text-center display-4" style= {{fontSize:"20px" , fontStyle: "italic"}}>Tempo: the speed or pace of a song</p>
        </header>
          <Button className="btn btn-lg" href={AUTH_URL}>Connect to Spotify</Button>
    </div>
}
 