import { useEffect, useState } from 'react'
import {
  redirectToSpotifyAuthorize,
  getActiveAccessToken,
  isAuthenticated,
} from '@/utils/spotifyAuth'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function Login() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        // If user already has a valid token, redirect to home page
        const accessToken = await getActiveAccessToken()

        if (accessToken && isMounted) {
          navigate('/')
          return
        }

        // Otherwise, redirect to Spotify auth page after a brief delay
        if (isMounted) {
          const timer = setTimeout(() => {
            redirectToSpotifyAuthorize()
          }, 500) // Small delay for better UX

          return () => clearTimeout(timer)
        }
      } catch (err) {
        console.error('Error checking authentication:', err)

        // Still redirect to authorize if there's an error
        if (isMounted) {
          setTimeout(() => {
            redirectToSpotifyAuthorize()
          }, 500)
        }
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
