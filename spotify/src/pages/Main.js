import React from 'react'
import useAuth from "../hooks/useAuth"
import { useEffect, useState } from "react"
import SpotifyWebApi from 'spotify-web-api-node';
import { Spotify } from "react-spotify-embed"

const spotifyApi = new SpotifyWebApi({
    clientId: 'c9815be2d35041f69712acba82f994b9',
    clientSecret: '7b7db31553ad466e9cac3c24a3890bce'
});

export default function Main({code}) {
    const accessToken = useAuth(code)
    
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])
    

    const [bpm1, setBpm1] = useState(null)
    const [bpm2, setBpm2] = useState(null)
    const [genTrackSuccess, setGenTrackSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [generatedPlaylist, setGeneratedPlaylist] = useState("")

    async function generateTracks() {
        if (isNaN(parseFloat(bpm1)) || isNaN(parseFloat(bpm2)) || bpm1 == null || bpm2 == null || parseFloat(bpm1) > parseFloat(bpm2)) {    
            alert("Please enter a valid range of BPM values.")
        } else {
            const tracks = []

            // get all saved tracks
            const data = await spotifyApi.getMySavedTracks({
                limit: 50,
                offset: 1
            }).then(data => {
                return data;
            })
            
            setLoading(true)
            // get tracks from specified bpm range from saved tracks
            for (let track_obj of data.body.items) {
                const track = track_obj.track
                const track_analysis = await spotifyApi.getAudioFeaturesForTrack(track.id)
                .then(data => {
                    return data;
                })
                const tempo = track_analysis.body.tempo
                if (parseFloat(bpm1) <= parseFloat(tempo) && parseFloat(tempo) <= parseFloat(bpm2)) {
                    console.log(track)
                    tracks.push(track.uri)
                }
            }
            setLoading(false)

            console.log(tracks.length)
            if (tracks.length == 0) {
                alert("No saved tracks within BPM range.")
                return;
            }
             // create playlist of tracks from specific range
            const playlist = await spotifyApi.createPlaylist('BPM range: ' + bpm1 + '-' + bpm2)
            .then(data => {return data})
            spotifyApi.addTracksToPlaylist(playlist.body.id, tracks);
            setGeneratedPlaylist("https://open.spotify.com/playlist/" + playlist.body.id)
            setGenTrackSuccess(true)
        }
    }


    return (
            <div>
                {!genTrackSuccess ? (<><h1>Enter a range of BPM values:</h1><label>BPM 1: </label><input type="text" value={bpm1} onChange={(e) => setBpm1(e.target.value)} /><label> BPM 2: </label><input type="text" value={bpm2} onChange={(e) => setBpm2(e.target.value)} /><button onClick={generateTracks}>Create Playlist</button></>)
                : (<><script src="https://open.spotify.com/embed-podcast/iframe-api/v1" async></script><h1>Your Spotify Playlist has been created!</h1><Spotify link={generatedPlaylist} /><button onClick={window.open(generatedPlaylist)}>Open in Spotify</button></>)}
                {/* <h1>Enter a range of BPM values:</h1>
                <label>BPM 1: </label>
                <input type="text" value = {bpm1} onChange={(e)=> setBpm1(e.target.value)} />
                <label> BPM 2: </label>
                <input type="text" value = {bpm2} onChange={(e)=> setBpm2(e.target.value)} />
                <button onClick={generateTracks}>Create Playlist</button>
                <RenderResult /> */}
            </div>
        )
}