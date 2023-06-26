import React from 'react'
import useAuth from "../hooks/useAuth"

export default function Main({code}) {
    const accessToken = useAuth(code)
    return (
            <div>
                <h1>{code}</h1>
            </div>
        )
}