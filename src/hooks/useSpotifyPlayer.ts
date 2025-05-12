import { useState, useEffect, useCallback } from 'react'
import { useSpotifyToken } from './useSpotifyToken'

interface Device {
  id: string
  is_active: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
}

interface PlayerState {
  device: Device
  repeat_state: string
  shuffle_state: boolean
  context: any
  timestamp: number
  progress_ms: number
  is_playing: boolean
  item: any
  currently_playing_type: string
  actions: any
}

export function useSpotifyPlayer() {
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken()
  const [player, setPlayer] = useState<PlayerState | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch current player state
  const fetchPlayer = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.status === 204) {
        setPlayer(null)
      } else if (res.ok) {
        const data = await res.json()
        setPlayer(data)
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchDevices = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setDevices(data.devices)
      }
    } catch {}
  }, [token])

  // Player controls
  const play = useCallback(
    async (body?: any) => {
      if (!token) return
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      fetchPlayer()
    },
    [token, fetchPlayer]
  )

  const pause = useCallback(async () => {
    if (!token) return
    await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchPlayer()
  }, [token, fetchPlayer])

  const next = useCallback(async () => {
    if (!token) return
    await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchPlayer()
  }, [token, fetchPlayer])

  const previous = useCallback(async () => {
    if (!token) return
    await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchPlayer()
  }, [token, fetchPlayer])

  const setRepeat = useCallback(
    async (state: 'track' | 'context' | 'off') => {
      if (!token) return
      await fetch(
        `https://api.spotify.com/v1/me/player/repeat?state=${state}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      fetchPlayer()
    },
    [token, fetchPlayer]
  )

  const setVolume = useCallback(
    async (volume_percent: number) => {
      if (!token) return
      await fetch(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume_percent}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      fetchPlayer()
    },
    [token, fetchPlayer]
  )

  const setShuffle = useCallback(
    async (state: boolean) => {
      if (!token) return
      await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${state}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      fetchPlayer()
    },
    [token, fetchPlayer]
  )

  const addToQueue = useCallback(
    async (uri: string) => {
      if (!token) return
      await fetch(
        `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(
          uri
        )}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    },
    [token]
  )

  useEffect(() => {
    if (tokenLoading || tokenError || !token) return
    fetchPlayer()
    fetchDevices()
  }, [token, tokenLoading, tokenError, fetchPlayer, fetchDevices])

  return {
    player,
    devices,
    loading,
    error: error || tokenError,
    play,
    pause,
    next,
    previous,
    setRepeat,
    setVolume,
    setShuffle,
    addToQueue,
    refresh: fetchPlayer,
    refreshDevices: fetchDevices,
  }
}
