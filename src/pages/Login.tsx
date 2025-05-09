import { useEffect } from 'react'
import { redirectToSpotifyAuthorize, getAccessToken } from '@/utils/spotifyAuth'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function Login() {
  const accessToken = getAccessToken()
  const navigate = useNavigate()

  useEffect(() => {
    // If user already has a valid token, redirect to home page
    if (accessToken) {
      navigate('/')
      return
    }

    // Otherwise, redirect to Spotify auth page
    const timer = setTimeout(() => {
      redirectToSpotifyAuthorize()
    }, 500) // Small delay for better UX

    return () => clearTimeout(timer)
  }, [accessToken, navigate])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-sprimary" />
      <h2 className="text-xl font-medium">Redirecionando para o Spotify...</h2>
      <p className="text-b4">Por favor, aguarde.</p>
    </div>
  )
}
