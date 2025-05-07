import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { exchangeToken, saveToken } from '../utils/spotifyAuth'

export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Try to get code from search params (traditional method)
    const urlParams = new URLSearchParams(window.location.search)
    let code = urlParams.get('code')

    // If code is not found in search params, try to extract it from the hash
    if (!code && window.location.hash) {
      // The hash might look like #/callback?code=xyz or #/?code=xyz
      const hashParams = new URLSearchParams(
        window.location.hash.split('?')[1] || ''
      )
      code = hashParams.get('code')
    }

    // As a last resort, check if the code is directly in the URL pathname
    if (!code) {
      // Check if the code is in the URL path
      const pathParts = window.location.pathname.split('/')
      if (pathParts.some((part) => part.startsWith('code='))) {
        const codePart = pathParts.find((part) => part.startsWith('code='))
        if (codePart) {
          code = codePart.replace('code=', '')
        }
      }
    }

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
    } else {
      console.error('No authorization code found in URL')
      // Optionally redirect to login page if no code is found
      navigate('/login')
    }
  }, [navigate])

  return <h1>Authenticating...</h1>
}
