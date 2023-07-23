import React from 'react'
import useAuth from "../hooks/useAuth"
import { useEffect, useState } from "react"
import SpotifyWebApi from 'spotify-web-api-node';
import { Spotify } from "react-spotify-embed";
import ReactSlider from "react-slider"
import "./Index.css"
import {Button} from 'react-bootstrap'
import {ClipLoader} from 'react-spinners'


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

    const MIN = 0;
    const MAX = 300;
    
    const [bpmVals, setBpmVals] = useState([MIN, MAX])
    const [genTrackSuccess, setGenTrackSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [generatedPlaylist, setGeneratedPlaylist] = useState("")

    async function generateTracks() {
        setGenTrackSuccess(false)
        setLoading(true)
        const tracks = []
        // get all saved tracks
        const data = await spotifyApi.getMySavedTracks({
            limit: 50,
            offset: 1
        }).then(data => {
            return data;
        })
        
        
        // get tracks from specified bpm range from saved tracks
        for (let track_obj of data.body.items) {
            const track = track_obj.track
            const track_analysis = await spotifyApi.getAudioFeaturesForTrack(track.id)
            .then(data => {
                return data;
            })
            const tempo = track_analysis.body.tempo
            if (parseFloat(bpmVals[0]) <= parseFloat(tempo) && parseFloat(tempo) <= parseFloat(bpmVals[1])) {
                console.log(track)
                tracks.push(track.uri)
            }
        }
        setLoading(false)

        console.log(tracks.length)
        if (tracks.length == 0) {
            alert("No tracks within BPM range.")
            return;
        }
            // create playlist of tracks from specific range
        const playlist = await spotifyApi.createPlaylist('BPM: ' + bpmVals[0] + '-' + bpmVals[1])
        .then(data => {return data})
        spotifyApi.addTracksToPlaylist(playlist.body.id, tracks);
        setGeneratedPlaylist("https://open.spotify.com/playlist/" + playlist.body.id)
        setGenTrackSuccess(true)
        
    }

    return (
        <>
        <div class="wrapper">
            <header>
                <h1 className="text-center display-4">Tempo Range</h1>
                <p className="text-center display-4" style={{ fontSize: "20px" }}>Use slider to select tempo range</p>
            </header>
            <div class="tempo-input">
                <p class="input">{bpmVals[0]} - {bpmVals[1]}</p>
            </div>
            <ReactSlider class={"slider"} trackClassName="track" onChange={setBpmVals} value={bpmVals} min={MIN} max={MAX} step={10} />
            <Button className="btn btn-lg" onClick={generateTracks} disabled={loading}>
                Generate Playlist
            </Button>
        </div>
        
        <div class="playlist-display-area">
                {loading ? (
                    <div class="loading-spinner">
                        <ClipLoader
                            color={"blueviolet"}
                            loading={loading}
                            size={100}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (<></>)}
                {genTrackSuccess ? (
                    <>
                        <div class="playlist-display">
                            <h1 className="text-center display-4" style={{ fontSize: "30px" }}>Your playlist has been generated!</h1>
                            <Spotify wide link={generatedPlaylist} />
                        </div>
                        <Button className="btn" onClick={() => window.open(generatedPlaylist)}>Open in Spotify</Button></>
                ) : (<></>)}
            </div>
        </>
        )
}