import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { exchangeToken, saveToken } from '../utils/spotifyAuth'

export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Em vez de buscar em window.location.search, verificamos a URL completa
    const url = window.location.href
    const hasCode = url.includes('?code=')

    if (hasCode) {
      // Extrair o código da URL completa
      const code = url.split('?code=')[1].split('#')[0]

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
    }
  }, [navigate])

  return <h1>Autenticando...</h1>
}
