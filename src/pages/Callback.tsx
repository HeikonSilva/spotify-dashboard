import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { exchangeToken, saveToken } from '../utils/spotifyAuth'

export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {
      exchangeToken(code).then((token) => {
        saveToken(token)
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
        navigate('/')
      })
    }
  }, [navigate])
  return <h1>Callback</h1>
}
