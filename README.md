# Attributify: a Spotify playlist generator
This project is an web application allowing users to generate custom Spotify playlists. Users can select their desired attributes for songs, and the app will generate a personalized playlist with recommended songs based on listening history and desired attributes.

## Setting up with Spotify
To run the app and use the Spotify Web API, you will need to register your own Spotify app with the Spotify Developer Dashboard and set the credentials within a config file. Process is as follows:
1. Create an application here: https://developer.spotify.com/
2. Add http://localhost:3000/callback as the redirect uri to the application
3. Create a <code>config.js</code> file in the root of the project and load in the <code>CLIENT_ID</code>, <code>CLIENT_SECRET</code>, and <code>REDIRECT_URI</code> variables

## Installing dependencies
In your console in the project directory, run <code>npm install --save</code>

## Running the app locally
For a development build, run <code>npm start && npm run devStart</code>




