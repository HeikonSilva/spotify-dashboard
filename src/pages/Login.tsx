import { useEffect } from 'react'
import {
  redirectToSpotifyAuthorize,
  getActiveAccessToken,
} from '@/utils/spotifyAuth'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      const accessToken = await getActiveAccessToken()

      if (accessToken && isMounted) {
        navigate('/')
        return
      }

      if (isMounted) {
        redirectToSpotifyAuthorize()
      }
    }

    checkAuth()
    return () => {
      isMounted = false
    }
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-sprimary" />
      <h2 className="text-xl font-medium">Redirecionando para o Spotify...</h2>
      <p className="text-b4">Por favor, aguarde.</p>
    </div>
  )
}
