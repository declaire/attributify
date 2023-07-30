import React from "react"
import { Button } from "react-bootstrap"
import "./Index.css"
const config = require('../config.js');

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var querystring = require('querystring');
var client_id = config.CLIENT_ID;
 // Your client id
var redirect_uri = config.REDIRECT_URI; // Your redirect uri
var scope = 'user-library-read user-library-modify playlist-modify-public user-top-read';
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
          <h1 className="text-center display-4" style={{fontSize:"100px"}}>Attributify</h1>
          <p className="text-center display-4" style={{fontSize:"20px"}}>A personalized playlist generator based on song attributes and your listening history.</p>
          <p className="text-center display-4" style= {{fontSize:"20px" , fontStyle: "italic"}}>Create playlists and discover music based on song tempo and energy</p>
      </header>
          <Button className="btn btn-lg" href={AUTH_URL}>Connect to Spotify</Button>
          <p className="text-center display-4" style={{fontSize:"20px"}}>Note: Attributify requires access to your listening history to recommend music you may like</p>
    </div>
}
 