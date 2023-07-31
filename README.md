# Attributify: a Spotify playlist generator
This project is an web application allowing users to generate custom Spotify playlists. Users can select their desired attributes for songs, and the app will generate a personalized playlist with recommended songs based on listening history and desired attributes.

## Demo

https://youtu.be/XJJCSKc7YOo

## Setting up with Spotify
To run the app and use the Spotify Web API, you will need to register your own Spotify app with the Spotify Developer Dashboard and set the credentials within a config file. Process is as follows:
1. Create an application here: https://developer.spotify.com/
2. Add http://localhost:3000/callback as the redirect uri to the application
3. Create a <code>config.js</code> file in the root of the project and load in the <code>CLIENT_ID</code>, <code>CLIENT_SECRET</code>, and <code>REDIRECT_URI</code> variables
4. Create the same <code>config.js</code> file in the spotify directory

## Installing dependencies
In the server and spotify directories, run <code>npm install --save</code> in your console

## Running the app locally
For a development build:
1. To start the server, enter the server directory and run <code>npm run devStart</code> in your console
2. To run the front end, enter the spotify directory and run <code>npm start</code> in your console
3. Open http://localhost:3000/ in your browser




