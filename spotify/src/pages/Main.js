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
    const BPMSTART = 120;
    const HIGHENERGY = [0.67, 1]
    const LOWENERGY = [0, 0.39]
    const MEDIUMENERGY = [0.4, 0.66]
    
    const accessToken = useAuth(code)
    
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken])

    const [bpm, setBpm] = useState(BPMSTART)
    const [energy, setEnergy] = useState("medium")
    const [energyForCalc, setEnergyForCalc] = useState(MEDIUMENERGY)
    const [genTrackSuccess, setGenTrackSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [generatedPlaylist, setGeneratedPlaylist] = useState("")
    const [emptyPlaylist, setEmptyPlaylist] = useState(false)

    const handleClick = (event) => {
        setEnergy(event.target.id);
        if (event.target.id === "low") {
            setEnergyForCalc(LOWENERGY)
        }
        else if (event.target.id === "medium") {
            setEnergyForCalc(MEDIUMENERGY)
        }
        else if (event.target.id === "high") {
            setEnergyForCalc(HIGHENERGY)
        }
    }
  
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

        const topTracks = await spotifyApi.getMyTopTracks({
            time_range: "short_term"
        })
        .then(data => {
            return data;
        })
        topTracksID.push(topTracks.body.items[0].id)
        topTracksID.push(topTracks.body.items[1].id)
        topTracksID.push(topTracks.body.items[2].id)
        // get recommended tracks 
        const recommendations = await spotifyApi.getRecommendations({
            limit: 100,
            target_tempo: bpm,
            min_tempo: bpm-10,
            max_tempo: bpm+10,
            min_energy: energyForCalc[0],
            max_energy: energyForCalc[1],
            seed_artists: topArtistsID,
            seed_tracks: topTracksID
          })
        .then(data => {
          return data;
        })
        for (let track_obj of recommendations.body.tracks) {
            tracks.push(track_obj.uri)
        }
  
        setLoading(false)

        if (tracks.length === 0) {
            setEmptyPlaylist(true)
            return;
        }
        // create playlist of tracks from specific range
        const playlist = await spotifyApi.createPlaylist('BPM: ' + bpm + ', Energy: ' + energy )
        .then(data => {return data})

        spotifyApi.addTracksToPlaylist(playlist.body.id, tracks);
        setGeneratedPlaylist("https://open.spotify.com/playlist/" + playlist.body.id)
        setGenTrackSuccess(true)
    
    }

    return (
        <>
        <div class="wrapper">
            <header>
                <p className="text-center display-4" style={{fontSize: "50px"}}>Tempo</p>
                <p className="text-center display-4" style={{ fontSize: "20px" }}>Tempo: the speed or pace of a song</p>
            </header>
            <div class="tempo-input">
                <p class="input">{bpm}</p>
            </div>
            <ReactSlider class={"slider"} trackClassName="track" onChange={setBpm} value={bpm} min={0} max={240} step={10} />

            <header>
                <p className="text-center display-4" style={{fontSize: "50px"}}>Energy</p>
                <p className="text-center display-4" style={{ fontSize: "20px" }}>Energy: the intensity and activity of a song</p>
            </header>
  
            <div class="energy-buttons">
                <Button className = {energy === "low" ? "active" : undefined} id = "low" onClick={handleClick}>Low</Button>
                <Button className = {energy === "medium" ? "active" : undefined} id = "medium" onClick={handleClick}>Medium</Button>
                <Button className = {energy === "high" ? "active" : undefined} id = "high" onClick={handleClick}>High</Button>

            </div>
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
                    <h1 className="text-center display-4" style={{ fontSize: "30px" }}>No songs with selected attributes.</h1>
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