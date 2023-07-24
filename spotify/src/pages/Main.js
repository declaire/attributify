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
    const [emptyPlaylist, setEmptyPlaylist] = useState(false)

    async function generateTracks() {
        setEmptyPlaylist(false)
        setGenTrackSuccess(false)
        setLoading(true)
        const tracks = []
        const topArtistsID = []
        const topTracksID = []
        //get top artists
        const topArtists = await spotifyApi.getMyTopArtists()
        .then(data => {
            return data;
        })
        topArtistsID.push(topArtists.body.items[0].id)
        topArtistsID.push(topArtists.body.items[1].id)

        const topTracks = await spotifyApi.getMyTopTracks()
        .then(data => {
            return data;
        })
        topTracksID.push(topTracks.body.items[0].id)
        topTracksID.push(topTracks.body.items[1].id)
        topTracksID.push(topTracks.body.items[2].id)
        // get recommended tracks 
        const recommendations = await spotifyApi.getRecommendations({
            limit: 50,
            min_tempo: parseFloat(bpmVals[0]),
            max_tempo: parseFloat(bpmVals[1]),
            seed_artists: topArtistsID,
            seed_tracks: topTracksID
          })
        .then(data => {
          return data;
        })

        console.log(recommendations)

        for (let track_obj of recommendations.body.tracks) {
            tracks.push(track_obj.uri)
        }
        setLoading(false)

        if (tracks.length === 0) {
            setEmptyPlaylist(true)
            return;
        }
        // create playlist of tracks from specific range
        const playlist = await spotifyApi.createPlaylist('BPM: ' + bpmVals[0] + '-' + bpmVals[1])
        .then(data => {return data})

        const chunkSize = 100;
        let index = 0;
        while (index < tracks.length) {
            const chunk = tracks.slice(index, index + chunkSize);
            spotifyApi.addTracksToPlaylist(playlist.body.id, chunk);
            index += chunkSize;
        }
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
                {emptyPlaylist && !loading ? (
                    <h1 className="text-center display-4" style={{ fontSize: "30px" }}>No tracks within selected tempo range.</h1>
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