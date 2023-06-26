import { useState, useEffect, useRef } from "react"
import axios from "axios"

export default function useAuth(code) {
    const [access_token, setAccessToken] = useState()
    const [refresh_token, setRefreshToken] = useState()
    const [expires_in, setExpiresIn] = useState()

    
    useEffect(() => {
        axios.post('http://localhost:3001/login', {
            code,
        }).then(res => {
            setAccessToken(res.data.access_token)
            setRefreshToken(res.data.refresh_token)
            setExpiresIn(res.data.expires_in)
            console.log(res.data)
            window.history.pushState({}, null, '/')
        })
    }, [code])

    useEffect(() => {
        if (!refresh_token ||!expires_in) return
        const interval = setInterval(() => {
            axios.post('http://localhost:3001/refresh', {
                refresh_token,
            }).then(res => {
                setAccessToken(res.data.access_token)
                setExpiresIn(res.data.expires_in)
            }).catch(() => {
                window.location = ('/')
            })
        }, (expires_in - 60) * 1000)
        return () => clearInterval(interval)
    }, [refresh_token, expires_in] )

    return access_token
}