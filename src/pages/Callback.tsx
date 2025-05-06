import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { fetchAccessToken } from '../utils/spotifyAuth'

export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      fetchAccessToken(code).then((data) => {
        localStorage.setItem('spotify_access_token', data.access_token)
        navigate('/', { replace: true })
      })
    }
  }, [navigate])
}
